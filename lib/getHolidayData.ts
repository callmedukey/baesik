//@ts-ignore
import xhr2 from "xhr2";
global.XMLHttpRequest = xhr2;
import jsdom from "jsdom";
import { formatDateString } from "./formatDateString";

export default async function getHolidayData(year: string) {
  let data: { [key: string]: string } = {};
  try {
    const promise = new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      var url =
        "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo"; /*URL*/
      var queryParams =
        "?" +
        encodeURIComponent("serviceKey") +
        "=" +
        process.env.OPENAPI_KEY; /*Service Key*/
      queryParams +=
        "&" +
        encodeURIComponent("solYear") +
        "=" +
        encodeURIComponent(year); /**/
      queryParams +=
        "&" +
        encodeURIComponent("numOfRows") +
        "=" +
        encodeURIComponent("9999"); /**/
      // queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent('09'); /**/
      xhr.open("GET", url + queryParams);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            // 응답이 성공했다면 (200)
            var parser = new jsdom.JSDOM(this.responseText);

            var xmlDoc = parser.window.document;

            // XML에서 원하는 데이터 추출
            var items = xmlDoc.getElementsByTagName("item");
            for (var i = 0; i < items.length; i++) {
              var locdate =
                items[i].getElementsByTagName("locdate")[0].textContent;
              var dateName =
                items[i].getElementsByTagName("dateName")[0].textContent;

              if (locdate && dateName) {
                data[formatDateString(locdate)] = dateName;
              }
            }

            resolve(data);
          } else {
            console.error("오류 발생. HTTP 상태 코드:", this.status);
            reject(new Error("오류 발생"));
          }
        }
      };

      xhr.send("");
    });

    return await promise;
  } catch (error) {
    console.error(error);
    return {
      error: "공휴일 정보를 불러오지 못했습니다",
    };
  }
}
