const fetch = require('node-fetch'); // node-fetch 라이브러리 필요
const fs = require('fs');

// GitHub Personal Access Token과 Repo 정보
const GITHUB_TOKEN = process.env.TOKEN;
const REPO_OWNER = 'banpobanpo';
const REPO_NAME = 'notice';
const FILE_PATH = 'notices.json';  // 수정할 파일 경로

// 수정할 JSON 내용 (예시)
const notices = {
    "월요일": {
        "1교시": "교과서",
        "4교시": "없음",
        "6교시": "필기구"
    },
    "화요일": {
        "2교시": "체육",
        "5교시": "인공지능기초",
        "7교시": "독서"
    },
    "수요일": {
        "1교시": "독서",
        "2교시": "진로와직업",
        "5교시": "확통",
        "6~7교시": "창체"
    },
    "목요일": {
        "3교시": "인공지능기초",
        "4교시": "음감비/미감비",
        "5교시": "심영독"
    },
    "금요일": {
        "2교시": "독서",
        "4교시": "확통",
        "6교시": "심영독"
    }
};

// GitHub API URL
const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

// GitHub API 요청
async function updateNotices() {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  const data = await response.json();
  const sha = data.sha;  // 기존 파일의 sha 값을 가져옴

  const updatedFileContent = Buffer.from(JSON.stringify(notices, null, 2)).toString('base64');

  const updateResponse = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update notices',
      committer: {
        name: 'GitHub Actions',
        email: 'actions@github.com'
      },
      sha: sha,  // 기존 파일의 sha 값으로 덮어쓰기를 수행
      content: updatedFileContent
    })
  });

  const updateData = await updateResponse.json();
  console.log('Updated notices:', updateData);
}

updateNotices().catch(console.error);
