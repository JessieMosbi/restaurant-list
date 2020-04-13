# Restaurant List
每天都在煩惱要吃什麼嗎？這是個用 [Node.js](https://nodejs.org/en/)、[Express](https://expressjs.com/)、[mongodb](https://www.mongodb.com/) 打造的網站，使用者註冊並登入後，可自行建立、編輯餐廳，更可用名稱搜尋、查看詳細資料，快速找到可去的餐廳！美食不等人，即刻查詢，立即出發！

![scrrenshot](https://github.com/JessieMosbi/restaurant-list/blob/master/features.gif?raw=true)

## Requirement
[Node.js](https://nodejs.org/en/)   
[mongodb](https://www.mongodb.com/)

## Packages
此專案用到以下 JS library，可藉由 `npm install` 指令去安裝（請參考底下 Installing 步驟）   
[express](https://expressjs.com/)   
[express-handlebars](https://www.npmjs.com/package/express-handlebars)   
[body-parser](https://www.npmjs.com/package/body-parser)   
[method-override](https://www.npmjs.com/package/method-override)   
[mongoose](https://mongoosejs.com/)   
[express-session](https://www.npmjs.com/package/express-session)   
[passport](http://www.passportjs.org/)   
[passport-local](http://www.passportjs.org/packages/passport-local/)   
[passport-facebook](http://www.passportjs.org/packages/passport-facebook/)   
[bcryptjs](https://www.npmjs.com/package/bcryptjs)   
[connect-flash](https://www.npmjs.com/package/connect-flash)   
[dotenv](https://www.npmjs.com/package/dotenv)

***

## Installing
開啟終端機 (Terminal)，透過 `git clone` 指令將專案下載下來到本機端
```console
git clone https://github.com/JessieMosbi/restaurant-list
```

進入 restaurant-list 資料夾內，並檢查是否有 package.json 檔案
```console
cd restaurant-list
```

執行 `npm install`，將專案所需套件下載下來
```console
npm install
```

## Setting
因此專案有結合 Facebook API，故需在 Facebook for developers 上設定一個應用程式，並把資訊填入 .env 檔才能正常啟用
.env 請放在根目錄底下
```console
// .env
FACEBOOK_ID=xxxxxxxx
FACEBOOK_SECRET=xxxxxxxx
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
```

## Executing
請在 mongodb 底下新增 restaurant 資料庫   
進到存放 mongodb 指令的 bin 資料夾，啟動 mongodb

下方範例的 mongodb 資料夾為根目錄底下的 mongodb/，存放資料庫紀錄的資料夾為根目錄底下的 mongodb-data/   
(opt) localhost 的 ip 為 127.0.0.1，此行不加也可以，只是會有 WARNING 提醒
```console
cd ~/mongodb/bin
./mongod --dbpath ~/mongodb-data --bind_ip 127.0.0.1
```

進到在 Installing 步驟中， 專案所安裝的資料夾底下，用專案所設定的統一指令，即可執行專案
```console
cd <Your download directory>/restaurant-list
npm run dev
```

預設 port 為 3000，請直接打開瀏覽器，並在 URL 輸入 http://localhost:3000/ 即可瀏覽網頁

## Other steps
可執行專案內的以下程式，自動在資料庫建立種子資料，以方便進行測試
```console
cd <Your download directory>/restaurant-list/models/seeds/
node restaurantSeeder.js
```

## Features
執行完 restaurantSeeder.js 檔案後（請參考上方步驟），可用以下種子資料進行測試
|Name    | Email                           | Password  |
|:------:|:-------------------------------:|:---------:|
|user1   | user1<span>@example.com</span>  | 12345678  |
|user2   | user2<span>@example.com</span>  | 12345678  |

+ 註冊、登入（可用 Facebook 登入）
+ 首頁查看餐廳資料（名稱、分類、評分）
+ 在首頁上方的搜尋方框，輸入名稱搜尋餐廳
+ 可將餐廳列表，選擇排序顯示（A -> Z、Z -> A、類別、地區）
+ 點選首頁任一餐廳圖片，可查看更詳細的資料（類別、地址、電話、評分）
+ 點選首頁任一餐廳圖片底下的編輯按鈕，可進入編輯頁面，編輯該餐廳資料
+ 點選首頁任一餐廳圖片底下的刪除按鈕，可將該餐廳資料刪除
+ 點選右上方的新增按鈕，可進入新增頁面，新增一筆餐廳資料
