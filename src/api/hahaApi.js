import axios from "axios";

class HahaApi {
  constructor(headers) {
    this.headers = headers;
    this.baseUrl = "https://prod.haha.me";
  }

  async userLogin(email, password) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/users/login`,
        { email, password },
        { headers: this.headers }
      );
      return response.data.id_token;
    } catch (error) {
      return null;
    }
  }

  async userBalance(token) {
    const query = {
      operationName: null,
      variables: {},
      query: "{\n  getKarmaPoints\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async getRankInfo(token) {
    const query = {
      operationName: null,
      variables: {},
      query:
        "{\n  getRankInfo {\n    rank\n    karma\n    karmaToNextRank\n    rankName\n    rankImage\n    __typename\n  }\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data.getRankInfo;
    } catch (error) {
      return null;
    }
  }

  async dailyCheckin(token) {
    const query = {
      operationName: null,
      variables: { timezone: "Asia/Jakarta" },
      query:
        "query ($timezone: String) {\n  getDailyCheckIn(timezone: $timezone)\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async claimCheckin(token) {
    const query = {
      operationName: null,
      variables: { timezone: "Asia/Jakarta" },
      query:
        "mutation ($timezone: String) {\n  setDailyCheckIn(timezone: $timezone)\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data.setDailyCheckIn;
    } catch (error) {
      return null;
    }
  }

  async basicTaskLists(token) {
    const query = {
      operationName: null,
      variables: {},
      query:
        "{\n  getOnboarding {\n    tasks {\n      task_id\n      type\n      name\n      description\n      completed\n      karma_available\n      __typename\n    }\n  }\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data.getOnboarding.tasks;
    } catch (error) {
      return null;
    }
  }

  async claimBasicTasks(token, taskId) {
    const query = {
      operationName: null,
      variables: { task_id: taskId },
      query:
        "mutation ($task_id: Int) {\n  setOnboarding(task_id: $task_id) {\n    task_id\n    success\n    completed_all\n    current_karma\n    __typename\n  }\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data.setOnboarding;
    } catch (error) {
      return null;
    }
  }

  async socialTaskLists(token) {
    const query = {
      operationName: null,
      variables: {},
      query:
        "{\n  getQuests {\n    name\n    description\n    karma_reward\n    status\n    __typename\n  }\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data.getQuests;
    } catch (error) {
      return null;
    }
  }

  async claimSocialTasks(token, taskName) {
    const query = {
      operationName: "claimQuestEx",
      variables: { questName: taskName },
      query:
        "mutation claimQuestEx($questName: String!) {\n  claimQuestEx(questName: $questName) {\n    success\n    message\n    __typename\n  }\n}",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/wallet-api/graphql`,
        query,
        { headers: { ...this.headers, Authorization: token } }
      );
      return response.data.data.claimQuestEx;
    } catch (error) {
      return null;
    }
  }
}

export default HahaApi;
