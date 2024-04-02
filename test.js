const { Builder, By, until, Key } = require("selenium-webdriver");
const assert = require("assert");

const browsers = {
  Chrome: "chrome",
  MicrosoftEdge: "MicrosoftEdge",
};

const accountList = [
  // success
  {
    id: 1,
    username: "hakiet1234",
    password: "12345678",
    case: "Đăng nhập thành công",
    assert: "Đăng nhập thành công! Vui lòng đợi trong giây lát...!",
    success: true,
  },
];

const mySelector = {
  username: {
    selector: "#username",
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

describe("Login Test", function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("MicrosoftEdge").build();
    this.timeout(30000);
    await driver.get("http://localhost:3000/auth/login");
    await driver.wait(until.elementLocated(By.id("email")), 7000);
    await driver.wait(until.elementLocated(By.id("password")), 7000);
    await setMySelector(driver, mySelector);
  });

  after(async function () {
    await driver.quit();
  });
  (() => {
    accountList.forEach(function (account) {
      it(account.case, async function () {
        this.timeout(30000);
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

        await driver.findElement(By.id("login-btn")).click();

        await driver.wait(
          until.elementLocated(By.css("div.Toastify__toast-body > div")),
          50000
        );

        const div = await driver.findElement(
          By.css("div.Toastify__toast-body > div")
        );
        const value = await div.getAttribute("innerHTML");

        if (value === account.assert) {
          console.log(
            `Test case passed for account: ${account.username}, ${account.assert}, ${value}`
          );
        } else {
          console.log(`Test case failed for account: ${account.username}`);
        }
        if (account.success) {
          await driver.wait(until.urlIs("http://localhost:3000/home"), 5000);
          const currentUrl = await driver.getCurrentUrl();
          console.log("currentUrl: ", currentUrl);
          assert.strictEqual(currentUrl, "http://localhost:3000/home");
          await driver.get("http://localhost:3000/auth/login");
          await driver.wait(until.elementLocated(By.id("username")), 7000);
          await driver.wait(until.elementLocated(By.id("password")), 7000);

          await setMySelector(driver, mySelector);
        } else {
          assert.strictEqual(value, account.assert);
          await driver.sleep(5000);
          await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a", Key.DELETE));
          await passwordInput.sendKeys(Key.chord(Key.CONTROL, "a", Key.DELETE));
        }
      });
    });
  })(accountList);
});
