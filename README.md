# ac-c3-m3-Restaurant 專案

目前所在課程進度：C4 M1 指標作業，將所有資料以資料庫方式進行載入，並加入 CRUD 功能

# 目前已完成項目

- 使用者可以註冊帳號，註冊的資料包括：名字、email、密碼、確認密碼。
- 使用者必須登入才能使用餐廳清單，如果沒登入，會被導向登入頁面
- 後端路由中(server site)檢驗 email 與密碼是必填欄位，但名字不是
- 如果使用者已經註冊過、沒填寫必填欄位、或是密碼輸入錯誤，就註冊失敗，並回應給使用者錯誤訊息
- 使用者也可以透過 Facebook Login 直接登入
- 使用者的密碼使用 bcrypt 來處理
- 登入後，使用者可以建立並管理專屬他的一個餐廳清單
- 使用者登出、註冊失敗、或登入失敗時，使用者都會在畫面上看到正確而清楚的系統訊息

# 在本地開啟時環境變數需先設置以下：

- $set SESSION_SECRET=
- $set FACEBOOK_APP_ID =
- $set FACEBOOK_APP_SECRET =
- $set FACEBOOK_CALLBACK_URL = http://localhost:3000/Users/oauth2/redirect/facebook
- $set NODE_ENV=development
- $npm run seed
- $npm run dev

# Environment 開發工具

- Node.js
- express.js
- express-handlebars
- MySQL
- mysql2
- sequelize
- sequelize-cli
