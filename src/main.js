import { getHeaders } from "./config/userAgents.js";
import HahaApi from "./api/hahaApi.js";
import AccountService from "./services/accountService.js";
import TaskService from "./services/taskService.js";
import Dashboard from "./ui/dashboard.js";

class HahaWallet {
  constructor() {
    this.dashboard = new Dashboard();
    this.api = new HahaApi(getHeaders(), this.dashboard);
    this.accountService = new AccountService(this);
    this.taskService = new TaskService(this.api, this);
  }

  log(message) {
    this.dashboard.logTask(message);
  }

  updateDashboard(component, content) {
    switch (component) {
      case "status":
        this.dashboard.setStatus(content);
        break;
      case "account":
        this.dashboard.setAccountInfo(content);
        break;
      case "balance":
        this.dashboard.setBalance(content);
        break;
      case "basicTasks":
        this.dashboard.updateBasicTasks(content);
        break;
      case "socialTasks":
        this.dashboard.updateSocialTasks(content);
        break;
      default:
        this.log(content);
    }
  }

  formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  async processAccounts(accounts) {
    for (const account of accounts) {
      if (account?.email && account?.password) {
        const maskedEmail = this.accountService.maskAccount(account.email);
        this.updateDashboard("account", `Processing: ${maskedEmail}`);

        await this.taskService.processAccount(
          account.email,
          account.password,
          (component, content) => this.updateDashboard(component, content)
        );

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  async main() {
    try {
      this.dashboard.start();
      const accounts = await this.accountService.loadAccounts();

      if (!accounts.length) {
        this.updateDashboard("status", "No accounts loaded");
        return;
      }

      this.updateDashboard("status", `Loaded ${accounts.length} accounts`);

      while (true) {
        await this.processAccounts(accounts);

        this.updateDashboard("status", "Waiting for next cycle...");
        let seconds = 12 * 60 * 60;

        while (seconds > 0) {
          this.updateDashboard(
            "status",
            ` All accounts processed.\n Next cycle in ${this.formatSeconds(
              seconds
            )}...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          seconds--;
        }
      }
    } catch (error) {
      this.updateDashboard("status", `Error: ${error.message}`);
      console.error(error);
    }
  }
}

try {
  const bot = new HahaWallet();
  bot.main().catch(console.error);
} catch (error) {
  console.error("Fatal error:", error);
  process.exit(1);
}
