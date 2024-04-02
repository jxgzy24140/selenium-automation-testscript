const { Builder, Capabilities, By, until } = require("selenium-webdriver");
const reset = "\x1b[0m";
const green = "\x1b[32m";
const red = "\x1b[31m";
const accountList = [
  {
    id: 1,
    username: "kiet1",
    password: "12345",
    result: "Your account has been blocked!",
  },
  {
    id: 2,
    username: "kiet2",
    password: "12345",
    result: "Login successful!",
  },
  {
    id: 3,
    username: "kiet3",
    password: "12345",
    result: "Username or password is wrong!",
  },
  {
    id: 4,
    username: "kiet123",
    password: "12345",
    result: "Something went wrong, please try it later!",
  },
  {
    id: 5,
    username: "kiet@69",
    password: "12345",
    result: "Username must not contain special character!",
  },
];
async function runTestOnGrid(account) {
  const gridUrl = "http://localhost:4444/wd/hub"; // URL của Selenium Grid
  const capabilities = Capabilities.chrome(); // Sử dụng trình duyệt Chrome

  // Khởi tạo một trình điều khiển WebDriver với cấu hình Selenium Grid
  const driver = await new Builder()
    .usingServer(gridUrl)
    .withCapabilities(capabilities)
    .build();

  try {
    await driver.get("http://localhost:3000/login");

    await driver.findElement(By.id("username")).sendKeys(account.username);
    await driver.findElement(By.id("password")).sendKeys(account.password);
    await driver.findElement(By.id("login-button")).click();
    await driver.wait(
      until.elementLocated(By.css("div.Toastify__toast-body > div")),
      5000
    );
    const div = await driver.findElement(
      By.css("div.Toastify__toast-body > div")
    );
    const value = await div.getAttribute("innerHTML");
    setTimeout(async () => {
      if (value === account.result)
        console.log(green + `TC${account.id} - PASSED!` + reset);
      else console.log(red + `TC${account.id} - FAILED!` + reset);
    }, 3000);
  } catch (err) {
    console.log("err: ", err);
    await driver.quit();
  } finally {
    await driver.quit();
  }
}

runTestOnGrid(accountList[0]).catch((error) => console.error(error));
