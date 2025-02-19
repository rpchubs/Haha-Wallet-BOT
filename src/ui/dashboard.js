import blessed from "blessed";
import contrib from "blessed-contrib";

class Dashboard {
  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Haha Wallet Bot Dashboard",
    });

    this.grid = new contrib.grid({
      rows: 14,
      cols: 12,
      screen: this.screen,
    });

    this.components = {};
    this.setupComponents();
    this.setupKeybindings();
  }

  setupComponents() {
    this.components.banner = this.grid.set(0, 0, 2, 12, blessed.box, {
      content:
        "{center}{bold}HaHa Wallet BOT{/bold}{/center}\n{center}Github: https://github.com/rpchubs | Telegram: https://t.me/RPC_Hubs{/center}",
      tags: true,
      border: { type: "line" },
      style: {
        border: { fg: "white" },
      },
    });

    this.components.status = this.grid.set(2, 0, 2, 12, blessed.box, {
      label: "Status",
      content: "Initializing...",
      border: { type: "line" },
      style: {
        border: { fg: "blue" },
      },
    });

    this.components.accountInfo = this.grid.set(4, 0, 3, 6, blessed.box, {
      label: "Account Information",
      border: { type: "line" },
      style: {
        border: { fg: "green" },
      },
    });

    this.components.balance = this.grid.set(4, 6, 3, 6, blessed.box, {
      label: "Balance",
      border: { type: "line" },
      style: {
        border: { fg: "yellow" },
      },
    });

    this.components.taskLog = this.grid.set(7, 0, 4, 12, contrib.log, {
      label: "Task Log",
      border: { type: "line" },
      style: {
        border: { fg: "cyan" },
      },
    });

    this.components.basicTasks = this.grid.set(11, 0, 3, 6, blessed.box, {
      label: "Basic Tasks",
      border: { type: "line" },
      scrollable: true,
      alwaysScroll: true,
      style: {
        border: { fg: "magenta" },
      },
    });

    this.components.socialTasks = this.grid.set(11, 6, 3, 6, blessed.box, {
      label: "Social Tasks",
      border: { type: "line" },
      scrollable: true,
      alwaysScroll: true,
      style: {
        border: { fg: "red" },
      },
    });
  }

  setupKeybindings() {
    this.screen.key(["escape", "q", "C-c"], () => process.exit(0));

    this.screen.key(["r"], () => this.refresh());
  }

  updateComponent(name, content) {
    if (this.components[name]) {
      if (name === "taskLog") {
        this.components[name].log(content);
      } else {
        this.components[name].setContent(content);
      }
      this.screen.render();
    }
  }

  setStatus(status) {
    this.updateComponent("status", status);
  }

  setAccountInfo(info) {
    this.updateComponent("accountInfo", info);
  }

  setBalance(balance) {
    this.updateComponent("balance", balance);
  }

  logTask(task) {
    this.updateComponent("taskLog", task);
  }

  updateBasicTasks(tasks) {
    this.updateComponent("basicTasks", tasks);
  }

  updateSocialTasks(tasks) {
    this.updateComponent("socialTasks", tasks);
  }

  refresh() {
    this.screen.render();
  }

  start() {
    this.refresh();
    return this;
  }
}

export default Dashboard;
