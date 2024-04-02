const XLSX = require("xlsx");
const { Builder, By, until, Key } = require("selenium-webdriver");
const { Capabilities } = require("selenium-webdriver/lib/capabilities");
const assert = require("assert");
const read = require("./helpers");
const { sendReportToMail } = require("./sendMailService");
const filePath = "D:\\Lab\\seminar\\Selenium2\\loginData.json";

let accountList = [];

const browsers = {
  Chrome: "chrome",
  MicrosoftEdge: "MicrosoftEdge",
};

const mySelector = {
  username: {
    selector: "#email",
    attribute: "test-id",
    value: "test-01",
  },
  password: {
    selector: "#password",
    attribute: "test-id",
    value: "test-02",
  },
};

const customeElement = async (driver, selector, attriName, customeAttri) => {
  await driver.executeScript(
    `document.querySelector('${selector}').setAttribute('${attriName}', '${customeAttri}')`
  );
};

const setMySelector = async (driver, mySelector) => {
  for (const key in mySelector) {
    await customeElement(
      driver,
      mySelector[key]["selector"],
      mySelector[key]["attribute"],
      mySelector[key]["value"]
    );
  }
};

const writeToExcel = (workbook, sheetData, browser) => {
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Test Report For Seminar");
  const filename = `login_test_report-${browser}.xlsx`;
  XLSX.writeFile(workbook, filename);
  sendReportToMail(filename);
};

const chromeCapabilities = Capabilities.chrome().set("platform", "WINDOWS");

const testFnc = async (data, browser) => {
  const workbook = XLSX.utils.book_new();
  const sheetData = [["Test Case", "Username", "Password", "Assert", "Result"]];
  let driver = await new Builder()
    .usingServer("http://localhost:4444/wd/hub")
    .withCapabilities(chromeCapabilities)
    // .forBrowser(browser)
    .build();

  await driver.get("http://localhost:3000/auth/login");
  console.log(await driver.getCurrentUrl());

  await driver.wait(until.elementLocated(By.id("email")), 7000);
  await driver.wait(until.elementLocated(By.id("password")), 7000);
  await setMySelector(driver, mySelector);

  try {
    for (const account of data) {
      await driver.wait(
        until.elementLocated(By.css("[test-id='test-01']")),
        7000
      );
      await driver.wait(
        until.elementLocated(By.css("[test-id='test-02']")),
        7000
      );

      const usernameInput = await driver.findElement(
        By.css("[test-id='test-01']")
      );
      await usernameInput.sendKeys(account.username);

      const passwordInput = await driver.findElement(
        By.css("[test-id='test-02']")
      );
      await passwordInput.sendKeys(account.password);

      await driver.findElement(By.id("submit-btn")).click();

      await driver.wait(
        until.elementLocated(By.css("div.Toastify__toast-body > div")),
        50000
      );
      const div = await driver.findElement(
        By.css("div.Toastify__toast-body > div")
      );
      const value = await div.getAttribute("innerHTML");
      console.log("value: ", value);
      if (value == account.assert) {
        sheetData.push([
          account.case,
          account.username,
          account.password,
          account.assert,
          true,
        ]);
        console.log(
          `Test case passed for account: ${account.username}, ${account.assert}, ${value}`
        );
      } else {
        sheetData.push([
          account.case,
          account.username,
          account.password,
          account.assert,
          false,
        ]);
        `Test case failed for account: ${account.username}, ${account.assert}, ${value}`;
      }

      if (account.success == true) {
        await driver.wait(until.urlIs("http://localhost:3000/home"), 5000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, "http://localhost:3000/home");

        let userIcon = await driver.wait(
          driver.findElement(By.id("user-icon")),
          10000
        );
        await driver.sleep(5000);
        await driver.findElement(By.id("user-icon")).click();

        await driver.wait(until.elementLocated(By.id("logout")), 7000);
        await driver.findElement(By.id("logout")).click();

        await driver.wait(until.elementLocated(By.id("email")), 7000);
        await driver.wait(until.elementLocated(By.id("password")), 7000);
        await setMySelector(driver, mySelector);
      } else {
        assert.strictEqual(value, account.assert);
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a", Key.DELETE));
        await passwordInput.sendKeys(Key.chord(Key.CONTROL, "a", Key.DELETE));
        await driver.sleep(4000);
      }
    }
  } catch (e) {
    console.log("error: ", e);
  }

  writeToExcel(workbook, sheetData, browser);
  await driver.quit();
};

const run = () => {
  accountList = read(filePath);
  testFnc(accountList, browsers.Chrome);
  // testFnc(accountList, browsers.MicrosoftEdge);
};

run();
