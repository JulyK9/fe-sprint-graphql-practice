// graphql 쿼리 로컬환경 수행 라이브러리 octokit 설치후 임포트
import { graphql } from "@octokit/graphql";
import { useEffect, useState } from "react";
import Discussions from "./Discussions";

// 인증 작업을 위한 환경변수를 구조분해 할당으로 설정
const { REACT_APP_GITHUB_AGORA_STATES_TOKEN, NODE_ENV } = process.env;

// 컴포넌트 외부에 레포지토리 자료를 가져오는 함수 구현
// 일종에 fetchData 함수 같은 거라고 보면됨
async function getRepository() {
  
  // authorization 을 안해주면 401 인증 에러남
  let token;
  if (NODE_ENV === 'development' || NODE_ENV === 'test') {
    token = REACT_APP_GITHUB_AGORA_STATES_TOKEN;
  }

  // octokit graphQL 라이브러리 'send a simple query' 참조
  const { repository, viewer } = await graphql(
    `
      {
        repository(name: "agora-states-fe", owner: "codestates-seb") {
          discussions(first: 100) {
            edges {
              node {
                id
                title
                createdAt
                url
                author {
                  login
                  avatarUrl
                }
                category {
                  name
                }
                answer {
                  author {
                    login
                  }
                }
              }
            }
          }
        }
        viewer {
          login
        }
      }
    `,
    {
      headers: {
        // 꼭 앞에 'token' 문자열 붙여주기 (아니면 'bearer'도 가능하다고 함)
        authorization: `token ${token}`,
      },
    }
  );

  // 리턴을 꼭 해줘야 데이터를 받을 수 있음
  return { repository, viewer };
}


function App() {

  // 데이터를 받아올 때 사용하는 일반적인 틀을 잊지말 것

  const [repository, setRepository] = useState({});
  const [viewer, setViewer] = useState({})

  const { discussions } = repository

  // useEffect로 처음 화면에서 받아온 데이터 처리
  useEffect(() => {
    getRepository()
      .then((data) => {
        setRepository(data.repository);
        setViewer(data.viewer)
      })
      .catch((error) => {
        console.log(Error.error);
    })
  }, [])

  console.log(repository);

  return (
    <>
      <div className="main">
        <header>
          <h1>My Agora States</h1>
          {viewer !== undefined ? (
            <div className="avatar--wrapper">
              <img src={viewer.avatarUrl} alt={`avatar of ${viewer.login}`} />
              <span>{viewer.login}</span>
            </div>
          ) : null}
        </header>
        <div className="main-wrapper">
          {discussions !== undefined ? (
            <Discussions discussions={discussions} />
          ) : (
            <div>loading...</div>
          )}
        </div>
        <footer>codestates</footer>
      </div>
    </>
  );
}

export default App;
