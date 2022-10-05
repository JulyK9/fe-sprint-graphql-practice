const Discussions = ({ discussions }) => {

  console.log(discussions); // 들어오는 자료의 형태 확인

  return (
    <section className="discussion--wrapper">
      <ul className="discussion--container">
        {discussions.edges.map((edge) => {
          return (
            <li className="discussion--li" key={edge.node.id}>
              <div className="avatar--wrapper">
                <img
                  src={edge.node.author.avatarUrl}
                  alt={`avatar of ${edge.node.author.login}`}
                />
              </div>
              <div className="discussion--content--wrapper">
                <div className="discussion--content--category">
                  {`[${edge.node.category.name}]`}
                </div>
                <h3 className="discussion--content--title">
                  <a href={edge.node.url}>{edge.node.title}</a>
                </h3>
                <div className="discussion--content--information">
                  {`
                    ${edge.node.author.login} /
                    ${new Date(edge.node.createdAt).toLocaleTimeString()}
                  `}
                </div>
              </div>
              <div className="discussion--answered">
                <p>{edge.node.answer ? "☑" : "☒"}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Discussions;
