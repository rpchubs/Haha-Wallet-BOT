class TaskService {
  constructor(api, logger) {
    this.api = api;
    this.logger = logger;
  }

  maskEmail(email) {
    if (email.includes("@")) {
      const [local, domain] = email.split("@");
      const masked = local.slice(0, 3) + "***" + local.slice(-3);
      return `${masked}@${domain}`;
    }
    return email;
  }

  async processAccount(email, password, updateDashboard) {
    const maskedEmail = this.maskEmail(email);
    this.logger.log(`Processing account: ${maskedEmail}`);
    updateDashboard("status", `Processing ${maskedEmail}`);

    const token = await this.api.userLogin(email, password);
    if (!token) {
      updateDashboard("status", `Login failed for ${maskedEmail}`);
      return;
    }

    const balance = await this.api.userBalance(token);
    const rankInfo = await this.api.getRankInfo(token);

    if (balance && rankInfo) {
      const rankDetails = [
        `Current Karma: ${balance.getKarmaPoints}`,
        `Rank: ${rankInfo.rankName} (Level ${rankInfo.rank})`,
        `Karma to Next Rank: ${rankInfo.karmaToNextRank}`,
      ].join("\n");

      updateDashboard("balance", rankDetails);
    }

    await this.processCheckin(token, updateDashboard);
    await this.processBasicTasks(token, updateDashboard);
    await this.processSocialTasks(token, updateDashboard);
  }

  async processCheckin(token, updateDashboard) {
    const checkIn = await this.api.dailyCheckin(token);
    if (!checkIn) {
      updateDashboard("checkin", "Check-in data fetch failed");
      return;
    }

    if (checkIn.getDailyCheckIn) {
      const claim = await this.api.claimCheckin(token);
      if (claim) {
        const newBalance = await this.api.userBalance(token);
        updateDashboard(
          "checkin",
          `Claimed > New Balance: ${newBalance?.getKarmaPoints} Karma`
        );
      } else {
        updateDashboard("checkin", "Claim failed");
      }
    } else {
      updateDashboard("checkin", "Already claimed today");
    }
  }

  async processBasicTasks(token, updateDashboard) {
    const basicTasks = await this.api.basicTaskLists(token);
    if (!basicTasks) {
      updateDashboard("basicTasks", "Failed to fetch basic tasks");
      return;
    }

    let taskLog = [];
    for (const task of basicTasks) {
      if (task.completed) {
        taskLog.push(`${task.name}: Already completed`);
        continue;
      }

      const claim = await this.api.claimBasicTasks(token, task.task_id);
      if (claim) {
        taskLog.push(`${task.name}: Claimed ${task.karma_available} Karma`);
      } else {
        taskLog.push(`${task.name}: Claim failed`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    updateDashboard("basicTasks", taskLog.join("\n"));
  }

  async processSocialTasks(token, updateDashboard) {
    const socialTasks = await this.api.socialTaskLists(token);
    if (!socialTasks) {
      updateDashboard("socialTasks", "Failed to fetch social tasks");
      return;
    }

    let taskLog = [];
    for (const task of socialTasks) {
      if (task.status === task.karma_reward) {
        taskLog.push(`${task.description}: Already completed`);
        continue;
      }

      const claim = await this.api.claimSocialTasks(token, task.name);
      if (claim) {
        taskLog.push(`${task.description}: Claimed ${task.karma_reward} Karma`);
      } else {
        taskLog.push(`${task.description}: Claim failed`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    updateDashboard("socialTasks", taskLog.join("\n"));
  }
}

export default TaskService;
