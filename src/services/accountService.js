import fs from "fs/promises";

class AccountService {
  constructor(logger) {
    this.logger = logger;
  }

  async loadAccounts() {
    try {
      const data = await fs.readFile("data.key", "utf8");
      return data
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [email, password] = line.split(":").map((s) => s.trim());
          return { email, password };
        });
    } catch (error) {
      this.logger.log('File "data.key" not found.');
      return [];
    }
  }

  maskAccount(account) {
    if (account.includes("@")) {
      const [local, domain] = account.split("@");
      const maskAccount = local.slice(0, 3) + "***" + local.slice(-3);
      return `${maskAccount}@${domain}`;
    }
    return account;
  }
}

export default AccountService;
