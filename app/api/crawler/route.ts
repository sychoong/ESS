// app/api/crawler/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  try {
    const email = process.env.USEREMAIL; // finpoints.com to login talentcloud.ai
    const password = process.env.USERPASSWORD; // 这个密码是 Microsoft 的密码

    const browser = await puppeteer.launch({
      headless: false, // ⬅️ 关键！关闭无头模式
      slowMo: 50, // ⬅️ 每个操作慢 50ms，让你看清楚过程（可选）
      defaultViewport: null, // ⬅️ 全屏窗口（可选）
      args: ["--start-maximized"],
      //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://doo.ess.talentcloud.ai/home", {
      waitUntil: "networkidle2",
    });

    const samlLoginUrl = page.url();
    await page.goto(samlLoginUrl, { waitUntil: "networkidle2" });

    // ✅ 填入 email
    // 1️⃣ 等待 & 填 email
    await page.waitForSelector('input[name="loginfmt"]', { timeout: 10000 });
    await page.type('input[name="loginfmt"]', email);
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.keyboard.press("Enter"),
    ]);

    // 2️⃣ 等待 & 填 password
    await page.waitForSelector('input[name="passwd"]', { timeout: 10000 });
    await page.type('input[name="passwd"]', password);

    // 3️⃣ 提交登录
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.keyboard.press("Enter"),
    ]);

    await page.waitForSelector("#idRichContext_DisplaySign", {
      timeout: 8000,
    });
    // 抓出号码
    const verificationNumber = await page.$eval(
      "#idRichContext_DisplaySign",
      (el) => (el as HTMLElement).innerText.trim()
    );

    console.log("📞 需要输入的验证号码:", verificationNumber);

    // 等待跳转到 Stay Signed In 页面
    await page.waitForSelector("#idBtn_Back", { timeout: 10000 });

    let tokenUrl = "";

    page.on("framenavigated", (frame) => {
      const url = frame.url();
      if (url.includes("token=") || url.includes("SAMLResponse")) {
        tokenUrl = url;
      }
    });

    // 点击 "No"
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click("#idBtn_Back"),
    ]);

    const token = tokenUrl.match(/token=([^&]+)/)?.[1];

    await browser.close();

    if (token) {
      return NextResponse.json({ token });
    } else {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Puppeteer error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
