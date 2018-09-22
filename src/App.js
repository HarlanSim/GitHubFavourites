import React, { Component } from 'react';
import './Modal.css';

class App extends Component {
	constructor() {
		super();
		this.state = { searchResults: [], input: '', favorites: [] };
		this.addToFavorites = this.addToFavorites.bind(this);
		this.parseSearchResults = this.parseSearchResults.bind(this);
		this.search = this.search.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	handleChange(e) {
		this.setState({ input: e.target.value });
	}

	onKeyDown(e) {
		if (e.keyCode === 13) {
			this.search();
		}
	}

	search() {
		let inputTextValue = this.state.input;
		const getGithubRepoURL = "https://api.github.com/search/repositories?q=" + inputTextValue;

		fetch(getGithubRepoURL)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.parseSearchResults(data.items);
			});
	}

	parseSearchResults(searchResultsObj) {
		let searchResults = [];
		if (searchResultsObj && searchResultsObj.length > 0) {
			let maxSearchResultsLength = (searchResultsObj.length > 10) ? 10 : searchResultsObj.length;
			for (var i = 0; i < maxSearchResultsLength; i++) {
				console.log(i);
				let repo = searchResultsObj[i];
				let latestTag = "-";
				fetch(repo.tags_url)
					.then(response => response.json())
					.then(data => {
						console.log(data);
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
		}
	}

	addToFavorites(repo) {
		repo.isFavourite = true;

		// Replace the search result
		let searchResults = this.state.searchResults;

		console.log("Current search results: " + JSON.stringify(searchResults));

		searchResults.find((r, i) => {
			if (r.name === repo.name) {
				searchResults[i] = repo;
				return true; // stop searching
			}
		});

		console.log("Replaced search result : " + JSON.stringify(searchResults));

		// Add to favorites
		let favorites = this.state.favorites;
		favorites.push(repo);

		// Push changes
		this.setState({ favorites: favorites, searchResults: searchResults })
	}

	removeFromFavorites(repo) {
		repo.isFavourite = false;


		// Replace the search result
		let searchResults = this.state.searchResults;

		console.log("Current search results: " + JSON.stringify(searchResults));

		searchResults.find((r, i) => {
			if (r.name === repo.name) {
				searchResults[i] = repo; // Replace
				return true; // stop searching
			}
		});

		console.log("Replaced search result : " + JSON.stringify(searchResults));

		// Remove from favorites
		let favorites = this.state.favorites;
		console.log("Current favorites : " + JSON.stringify(favorites));
		favorites.find((r, i) => {
			if (r.name === repo.name) {
				favorites.splice(i, 1); // Remove
				return true; // stop searching
			}
		});
		console.log("Replaced favorites : " + JSON.stringify(favorites));

		// Push changes
		this.setState({ favorites: favorites, searchResults: searchResults })
	}

	fillRows(repoList, isSearchTable) {
		var rows = [];
		if (repoList !== undefined) {
			for (var i = 0; i < repoList.length; i++) {
				let cell = [];
				let cellID = `cell${i}`;

				let repo = repoList[i];

				cell.push(<td key={cellID + '-0'}>{repo.name}</td>);
				cell.push(<td key={cellID + '-1'}>{repo.language}</td>);
				cell.push(<td key={cellID + '-2'}>{repo.latestTag}</td>);

				if (isSearchTable) {
					cell.push(<td key={cellID + '-3'}>{
						repo.isFavourite === true ?
							'' :
							<a onClick={() => this.addToFavorites(repo)}>Add</a>
					}</td>);
				} else {
					cell.push(<td key={cellID + '-3'}>{
						repo.isFavourite === true ?
							<a onClick={() => this.removeFromFavorites(repo)}>Remove</a> :
							''
					}
					</td>);
				}
				rows.push(<tr key={cellID}>{cell}</tr>);
			}
		}
		console.log(rows);
		return rows;
	}

	render() {
		const searchResults = this.state.searchResults;
		const favorites = this.state.favorites;

		let searchRows = this.fillRows(searchResults, true);
		let favoriteRows = this.fillRows(favorites);

		return (
			<div className="modal show">
				<div id="main-modal" className="modal-dialog">
					<div className="modal-content">
						<div className="top-bar">
							<span className="red dot" />
							<span className="yellow dot" />
							<span className="green dot" />
						</div>
						<div className="modal-header">
							<h3 className="modal-title">My GitHub Favorites</h3>
						</div>
						<div id="main-body">
							<div className="modal-panel col-md-6">
								<div className="search">
									<input className="search-bar" onChange={this.handleChange} onKeyDown={this.onKeyDown} />
									<button className="btn" type="submit" onClick={this.search}>Search</button>
								</div>
								<table id="simple-board" className="table">
									<thead>
										<tr>
											<th className="th-lg">Name</th>
											<th className="th-lg">Language</th>
											<th className="th-lg">Latest tag</th>
											<th className="th-sm"></th>
										</tr>
									</thead>
									<tbody>
										{searchRows}
									</tbody>
								</table>
							</div>

							<div className="modal-panel col-md-6" style={{ backgroundColor: '#f3ecfe' }}>
								<table id="simple-board" className="table">
									<thead>
										<tr>
											<th className="th-lg">Name</th>
											<th className="th-lg">Language</th>
											<th className="th-lg">Latest tag</th>
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
		this.language = language;
		this.isFavourite = false;
	}
}

export default App;
