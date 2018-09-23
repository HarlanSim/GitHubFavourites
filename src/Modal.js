import React, { Component } from 'react';
import './Modal.css';

const GITHUBSEARCHURL = "https://api.github.com/search/repositories?sort=updated&q=";

class App extends Component {
	constructor() {
		super();
		this.state = { searchResults: [], input: '', favorites: {} };
		this.addToFavorites = this.addToFavorites.bind(this);
		this.parseSearchResults = this.parseSearchResults.bind(this);
		this.search = this.search.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	handleChange(e) {
		if (e.target.value.length === 0) {
			// Clear search results if search bar is empty;
			this.setState({ input: e.target.value, searchResults: [] });
		} else {
			this.setState({ input: e.target.value });
		}
	}

	onKeyDown(e) {
		if (e.keyCode === 13) {
			this.search();
		}
	}

	search() {
		let inputTextValue = this.state.input;
		const searchGithubReposURL = GITHUBSEARCHURL + inputTextValue;

		fetch(searchGithubReposURL)
			.then(response => response.json())
			.then(data => {
				this.parseSearchResults(data.items);
			});
	}

	parseSearchResults(searchResultsObj) {
		let searchResults = [];
		if (searchResultsObj && searchResultsObj.length > 0) {
			// Only show a max of 10 search results
			let maxSearchResultsLength = (searchResultsObj.length > 10) ? 10 : searchResultsObj.length;
			for (var i = 0; i < maxSearchResultsLength; i++) {
				let repo = searchResultsObj[i];
				let latestTag = "-";

				// Need to look up latest tag for each search result
				fetch(repo.tags_url)
					.then(response => response.json())
					.then(data => {
						if (data && data.length) {
							latestTag = data[0].name;
						}
						let repository = new Repository(repo.full_name, repo.language, latestTag);
						searchResults.push(repository);

						if (searchResults.length === maxSearchResultsLength) {
							this.setState({ searchResults: searchResults });
						}
					});
			}
		} else {
			this.setState({ searchResults: [] });
		}
	}

	addToFavorites(repo) {
		// Add to favorites list
		let favorites = this.state.favorites;
		favorites[repo.name] = repo;
		this.setState({ favorites: favorites })
	}

	removeFromFavorites(repo) {
		let favorites = this.state.favorites;
		delete favorites[repo.name];
		this.setState({ favorites: favorites })
	}

	fillSearchRows(repoList) {
		var rows = [];
		if (repoList !== undefined) {
			for (var i = 0; i < repoList.length; i++) {
				let cell = [];
				let cellID = `cell${i}`;
				let repo = repoList[i];

				cell.push(<td key={cellID + '-0'}>{repo.name}</td>);
				cell.push(<td key={cellID + '-1'}>{repo.language}</td>);
				cell.push(<td key={cellID + '-2'}>{repo.latestTag}</td>);
				cell.push(<td key={cellID + '-3'}>{(this.state.favorites[repo.name]) ? '' : <a onClick={() => this.addToFavorites(repo)}>Add</a>}</td>);
				rows.push(<tr key={cellID}>{cell}</tr>);
			}
		}
		return rows;
	}

	fillFavoriteRows(repoList) {
		var rows = [];
		if (repoList !== undefined) {
			for (var r in repoList) {
				let cell = [];
				let cellID = `cell${r}`;
				let repo = repoList[r];

				cell.push(<td key={cellID + '-0'}>{repo.name}</td>);
				cell.push(<td key={cellID + '-1'}>{repo.language}</td>);
				cell.push(<td key={cellID + '-2'}>{repo.latestTag}</td>);
				cell.push(<td key={cellID + '-3'}>{<a onClick={() => this.removeFromFavorites(repo)}>Remove</a>}</td>);
				rows.push(<tr key={cellID}>{cell}</tr>);
			}
		}
		return rows;
	}

	render() {
		const searchResults = this.state.searchResults;
		const favorites = this.state.favorites;

		let searchRows = this.fillSearchRows(searchResults);
		let favoriteRows = this.fillFavoriteRows(favorites);

		return (
			<div className="modal show">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="top-bar">
							<span className="red dot" />
							<span className="yellow dot" />
							<span className="green dot" />
						</div>
						<div className="modal-header">
							<h3 className="modal-title">My GitHub Favorites</h3>
						</div>
						<div className="modal-body">
							<div className="modal-panel col-md-6">
								<div className="search">
									<input className="search-bar" onChange={this.handleChange} onKeyDown={this.onKeyDown} />
									<button className="btn" type="submit" onClick={this.search}>Search</button>
								</div>
								<table className="table">
									<thead>
										<tr>
											<th className="th-lg">Name</th>
											<th className="th-m">Language</th>
											<th className="th-m">Latest tag</th>
											<th className="th-xs"></th>
										</tr>
									</thead>
									<tbody>
										{searchRows}
									</tbody>
								</table>
							</div>

							<div className="modal-panel purple col-md-6">
								<table className="table">
									<thead>
										<tr>
											<th className="th-lg">Name</th>
											<th className="th-m">Language</th>
											<th className="th-m">Latest tag</th>
											<th className="th-sm"></th>
										</tr>
									</thead>
									<tbody>
										{favoriteRows}
									</tbody>
								</table>
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
	}
}

export default App;
