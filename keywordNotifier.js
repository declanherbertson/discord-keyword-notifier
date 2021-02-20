import fs from 'fs';
import pkg from 'selenium-webdriver';
import { sendMail } from './mail.js';
import { mapMessages } from './messageFormatting.js';
import { filterKeywords, filterTime, filterUsers } from './filtering.js';
import { time } from 'console';
const { Builder, By, Key, until } = pkg;
const configFileName = 'config.json';

async function notifier() {
  // read config information
  const config = JSON.parse(fs.readFileSync(configFileName));
  
  // Open Chrome Browser
  const driver = new Builder().forBrowser('chrome').build();

  process.on('SIGINT', function() {
    console.log("\nCaught interrupt signal");
      driver.quit().finally(() => process.exit(0));
  });

  // Open WTB channel
  await driver.get(config.channelUrl);

  // Wait until logged in
  await driver.wait(until.titleIs(config.channelName))

  console.log('started waiting')
  await driver.sleep(config.discordStartupTime * 1000);
  console.log('finished waiting')

  while (true) {
    const messages = await driver.findElements(By.css("div[role=listitem][class^=message]"))

    const messageObjects = await mapMessages(messages);

    const timeFilteredMessages = filterTime(config.lastTimeChecked, messageObjects);
    const userFilteredMessages = filterUsers(config.excludeUsers, timeFilteredMessages);
    const reportMessages = filterKeywords(config.keywords, userFilteredMessages);

    // reset at midnight
    const t = new Date()
    if (t.getHours() === 0 && (t.getMinutes() === 0 || t.getMinutes() === 1)) {
      config.lastTimeChecked = "";
      fs.writeFileSync(configFileName, JSON.stringify(config, null, 2));
      await driver.sleep(config.checkInverval * 1000);
      continue;
    }

    // save new time
    if (messageObjects[messageObjects.length - 1].time !== config.lastTimeChecked) {
      config.lastTimeChecked = messageObjects[messageObjects.length - 1].time;
      fs.writeFileSync(configFileName, JSON.stringify(config, null, 2));
    }
  
    if (reportMessages.length) {
      console.log('triggered', reportMessages)
      // email messages
      sendMail(JSON.stringify(reportMessages, null, 2));
    }
    await driver.sleep(config.checkInverval * 1000);
  }
}

notifier();

