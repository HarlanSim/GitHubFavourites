import React, { Component } from 'react';
import './Modal.css';

class App extends Component {
  constructor() {
    super();
    this.state = {items: {}};
    this.getRepos = this.getRepos.bind(this);
  }

  componentDidMount() {
    const getGithubRepoURL = "https://api.github.com/search/repositories?q=type";
    fetch(getGithubRepoURL)
      .then(response => response.json())
      .then(data => { 
        console.log(data);
        this.getRepos(data.items);
      });
  }

  getRepos(repoListObj) {
    let repoList = [];
    let length = (repoListObj.length > 10) ? 10 : repoListObj.length;
    for(var i in repoListObj) {
      let repo = repoListObj[i];
      let latestTag = "";
      fetch(repo.tags_url)
        .then(response => response.json())
        .then(data => { 
          console.log(data);
          if (data && data.length) {
            latestTag = data[0].name;
            let repository = new Repository(repo.name, repo.language, latestTag);
            repoList.push(repository);
            console.log(repository);
          }
          if (i + 1 === length) {
            console.log("REPO LIST" + repoList);
            this.setState({ items: repoList });
          } else {
            console.log(i);
          }
        });
    }
  }

  render() {
    const modalTitle = "My GitHub Favourites";
    const items = this.state.items;
    let item = (items[0] === undefined) ? "a": "b";
    return (
      <div className="modal show">
            <div id="main-modal" className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>       
                        <h3 className="modal-title">{modalTitle}</h3>
                    </div>
                    <div id="main-body">
                        <div className="col-md-6 h-100">
                          {item}
                        </div> 
                        <div className="col-md-6 h-100" style={{backgroundColor: '#f3ecfe'}}>
                            
                        </div>
                    </div>
                </div>
            </div>
      </div>
    );
  }
}

class Repository {
  constructor(name, language, latestTag) {
    this.name = name;
    this.language = language;
    this.latestTag = latestTag;
    this.language = language;
    this.isFavourite = false;
  }
}

export default App;
