import { stopWords } from "../../constants/data"

var sortJSON = function(data, key, type) {
  if (type == undefined) {
    type = "asc";
  }
  return data.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    if (type == "desc") {
      return x > y ? -1 : x < y ? 1 : 0;
    } else if (type == "asc") {
      return x < y ? -1 : x > y ? 1 : 0;
    }
  });
};

const morphologicalAnalyzer = async (plaintext) => {
//export default function morphologicalAnalyzer(plaintext) {
    var wordList = []
    //console.log(plaintext)
    plaintext = plaintext.toLowerCase()
    plaintext = plaintext.replace('.', ' ')
    wordList = plaintext.split(/(?:,| )+/)
    //console.log(wordList)

    const allwordList = []
    var isFind = false;
    var isStopword = false;
    for ( var i = 0; i < wordList.length; i++ )
    {
      isFind = false;
      isStopword = false;

      // 결과값에서 해당 단어가 있는지 찾는다. 
      for (var j = 0; j < allwordList.length; j++)
      {
        // 기존에 입력된 결과값의 단어가 있으면 카운트를 올려준다. 
        if (allwordList[j].id == wordList[i])
        {
          isFind = true
          allwordList[j].count = allwordList[j].count + 1
        }
      }

      // 기존에 입력된 결과가 없으면 새로 추가한다. 
      if (!isFind)
      {
        // 불용어는 추가하지 않는다. 
        for (var k = 0; k < stopWords.length; k++)
        {
          if (stopWords[k] == wordList[i])
          {
            isStopword = true
          }
        }

        if (!isStopword)
        {
          allwordList.push({'id': wordList[i], 'count': 1})
        }
        else
        {
          //console.log('STOP WORD : ' + wordList[i])
        }
      }
    }
//    console.log(allwordList)
//    console.log(sortJSON(allwordList, "count", "desc"));

    const sortedList = sortJSON(allwordList, "count", "desc")
    console.log("sortedList count : ", sortedList.length);
    const top20List = []
    for (var i = 0; i < 50; i++)
    {
      if(i < sortedList.length)
      {
        top20List.push(sortedList[i].id)
      }
    }

    console.log('top 50 is : ' + top20List)
    
    // type check 타입체크
    // console.log(countedwordList.constructor);
    //console.log(countedwordList)


    // var votes = ["kim", "hong", "lee", "hong", "lee", "lee", "hong"];
    // var reducer = function(accumulator, value, index, array) {
    //   if (accumulator.hasOwnProperty(value)) 
    //   {
    //     accumulator[val] = accumulator[val] + 1;
    //   } else {
    //     accumulator[val] = 1;
    //   }
    //   return accumulator;
    // }
    // var initialValue = {};
    // var result = votes.reduce(reducer, initialValue);
    // console.log(result); // { kim: 1, hong: 3, lee: 3 }

    return top20List
}

export default morphologicalAnalyzer

// 제가 본 ChatGPT를 이용한 개발 (Python, JavaScript, Node.js, SQL, DevOps, Hacking, Data Analysis and ML 등) YouTube 영상 중 인상 깊었던 것들 공유드립니다.
// 1. ChatGPT Tutorial for Developers - 38 Ways to 10x Your Productivity (2023.1.14)
// https://youtu.be/sTeoEFzVNSc
// 05:00 General Examples
// 12:10 Python Examples
// 16:53 HTML & CSS Examples
// 19:19 JavaScript Examples
// 22:04 Node.js Examples
// 24:13 SQL Examples
// 2. I challenged ChatGPT to code and hack (Are we doomed?) (2022.12.17)
// https://youtu.be/Fw5ybNwwSbg
// 04:18 - C programming code
// 08:34 - Python SSH brute force script
// 13:51 - Rubber Ducky scripts (Windows 11)
// 15:57 - Rubber Ducky scripts on Android
// 17:05 - Nmap scans
// 19:12 - Cisco configs - Switches and BGP
// 3. ChatGPT Tutorial - Use ChatGPT for DevOps tasks to 10x Your Productivity (2023.1.18)
// https://youtu.be/l-kE11fhfaQ
// 09:23 - Create Dockerfile for Node.js app using ChatGPT
// 22:13 - Create Kubernetes manifest file using ChatGPT
// 35:06 - Create CI/CD pipeline code using ChatGPT
// 50:06 - Convert Jenkinsfile into GitLab CI config file
// 53:53 - Tools built on top of OpenAI's API
// 55:01 - AIaC demo - CLI tool for DevOps
// 4. How to Learn Python FAST with ChatGPT? (2023.01.28)
// https://youtu.be/tEn5BjRY8Uw
// 02:03 Roadmap
// 04:24 SQL to Python
// 05:26 Simplify concepts
// 06:22 Write new code
// 07:03 Other ChatGPT hacks
// 5. Analysing Data with ChatGPT (Data Analysis and ML) (2022.12.24)
// https://youtu.be/Dw0irOIJYnA
// 03:30 Class Distribution and Pivot Tables with ChatGPT
// 06:02 Value Counts
// 06:45 Group By with ChatGPT
// 08:01 Encoding Dataset with ChatGPT
// 09:25 Model Building
// 11:20 Evaluate the Model
// 12:10 Model Interpretation