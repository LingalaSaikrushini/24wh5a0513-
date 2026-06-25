const LOG_API_URL = "http://4.224.186.213/evaluation-service/log";

async function Log(stack, level, packageName, message) {
  const validStacks = ["backend", "frontend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = ["auth","cache","config","controller","cron_job","db","domain","handler","middleware","repository","route","service","utils","style"];

  if (!validStacks.includes(stack) || !validLevels.includes(level)) {
    console.error(Invalid log params: /);
    return;
  }

  const payload = {
    stack,
    level,
    package: packageName,
    message: typeof message === "string" ? message : JSON.stringify(message)
  };

  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \Bearer \\
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log([LOG SUCCESS]  -  - );
    }
  } catch (err) {
    console.error("[LOG FAILED]", err.message);
  }
}

module.exports = { Log };
