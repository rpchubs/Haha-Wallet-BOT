import axios from "axios";
import fs from "fs";
import { HttpsProxyAgent } from "https-proxy-agent";
import { HttpProxyAgent } from "http-proxy-agent";

class HahaApi {
  constructor(headers, dashboard) {
    this.headers = headers;
    this.baseUrl = "https://prod.haha.me";
    this.dashboard = dashboard; // ✅ Use the passed dashboard instance

    this.proxies = this.loadProxies();
    this.proxyIndex = 0;
    this.currentProxy = this.getNextProxy();

    this.axiosInstance = this.createAxiosInstance();
    this.logCurrentProxyIP();
  }

  setDashboardStatus(message) {
    if (this.dashboard) {
      this.dashboard.setStatus(message);
    } else {
      console.log(`[STATUS] ${message}`);
    }
  }

  logTask(message) {
    if (this.dashboard) {
      this.dashboard.logTask(message);
    } else {
      console.log(`[TASK] ${message}`);
    }
  }

  loadProxies() {
    try {
      const proxies = fs.readFileSync("proxies.txt", "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("http"));

      if (proxies.length === 0) {
        this.setDashboardStatus(" No proxies found! Using default connection.");
      }

      return proxies;
    } catch (error) {
      this.setDashboardStatus(" Error reading proxies.txt: " + error.message);
      return [];
    }
  }

  getNextProxy() {
    if (this.proxies.length === 0) return null;

    const proxy = this.proxies[this.proxyIndex];
    this.proxyIndex = (this.proxyIndex + 1) % this.proxies.length;
    return proxy;
  }

  createAxiosInstance() {
    if (!this.currentProxy) {
      this.setDashboardStatus(" Using direct connection (No Proxy)");
      return axios.create({ timeout: 30000 });
    }

    const isHttp = this.currentProxy.startsWith("http://");
    const agent = isHttp ? new HttpProxyAgent(this.currentProxy) : new HttpsProxyAgent(this.currentProxy);

    return axios.create({
      timeout: 30000,
      proxy: false,
      httpAgent: isHttp ? agent : undefined,
      httpsAgent: !isHttp ? agent : undefined,
    });
  }

  async logCurrentProxyIP() {
    if (!this.currentProxy) {
      this.setDashboardStatus("🔹 Using direct connection (No Proxy)");
      return;
    }

    try {
      const response = await this.axiosInstance.get("http://api64.ipify.org?format=json");
      this.setDashboardStatus(`Proxy IP: ${response.data.ip}`);
    } catch (error) {
      this.setDashboardStatus("Failed to fetch proxy IP.");
    }
  }

  switchProxy() {
    this.currentProxy = this.getNextProxy();
    this.axiosInstance = this.createAxiosInstance();
    this.setDashboardStatus(`Switched to next proxy`);
    this.logCurrentProxyIP();
  }

  async fetch(url, method = "GET", token, body = {}, additionalHeaders = {}) {
    try {
      const headers = { ...this.headers, Authorization: token, ...additionalHeaders };

      const response = await this.axiosInstance({
        method,
        url,
        headers,
        data: method !== "GET" ? body : undefined,
      });

      return response.data;
    } catch (error) {
      console.error(` API Request Failed: ${url} | ${error.message}`);
      return null;
    }
  }

  async userLogin(email, password) {
    this.logCurrentProxyIP();

    const response = await this.fetch(`${this.baseUrl}/users/login`, "POST", null, { email, password });
    return response ? response.id_token : null;
  }

  async userBalance(token) {
    const query = { operationName: null, variables: {}, query: "{\n  getKarmaPoints\n}" };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data : null;
  }

  async getRankInfo(token) {
    const query = {
      operationName: null,
      variables: {},
      query: "{\n  getRankInfo {\n    rank\n    karma\n    karmaToNextRank\n    rankName\n    rankImage\n    __typename\n  }\n}",
    };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data.getRankInfo : null;
  }

  async dailyCheckin(token) {
    const query = { operationName: null, variables: { timezone: "Asia/Jakarta" }, query: "query ($timezone: String) {\n  getDailyCheckIn(timezone: $timezone)\n}" };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data : null;
  }

  async claimCheckin(token) {
    const query = { operationName: null, variables: { timezone: "Asia/Jakarta" }, query: "mutation ($timezone: String) {\n  setDailyCheckIn(timezone: $timezone)\n}" };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data.setDailyCheckIn : null;
  }

  async basicTaskLists(token) {
    const query = { operationName: null, variables: {}, query: "{\n  getOnboarding {\n    tasks {\n      task_id\n      type\n      name\n      description\n      completed\n      karma_available\n      __typename\n    }\n  }\n}" };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data.getOnboarding.tasks : null;
  }

  async claimBasicTasks(token, taskId) {
    const query = {
      operationName: null,
      variables: { task_id: taskId },
      query: "mutation ($task_id: Int) {\n  setOnboarding(task_id: $task_id) {\n    task_id\n    success\n    completed_all\n    current_karma\n    __typename\n  }\n}",
    };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data.setOnboarding : null;
  }

  async socialTaskLists(token) {
    const query = { operationName: null, variables: {}, query: "{\n  getQuests {\n    name\n    description\n    karma_reward\n    status\n    __typename\n  }\n}" };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data.getQuests : null;
  }

  async claimSocialTasks(token, taskName) {
    const query = {
      operationName: "claimQuestEx",
      variables: { questName: taskName },
      query: "mutation claimQuestEx($questName: String!) {\n  claimQuestEx(questName: $questName) {\n    success\n    message\n    __typename\n  }\n}",
    };
    const response = await this.fetch(`${this.baseUrl}/wallet-api/graphql`, "POST", token, query);
    return response ? response.data : ""
  }
}

export default HahaApi;