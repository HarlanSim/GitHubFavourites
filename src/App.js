import React, { Component } from 'react';
import './Modal.css';

class App extends Component {
	constructor() {
		super();
		this.state = { searchResults: [], input: '', favorites: []};
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
		console.log("Add to favourites!!")
		repo.isFavourite = true;
		
		console.log("Current search results: " + JSON.stringify(searchResults));

		// Replace the search result
		let searchResults = this.state.searchResults;
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
		this.setState({favorites: favorites})
	}

	render() {
		const searchResults = this.state.searchResults;
		const favorites = this.state.favorites;

		let searchRows = [];
		let favoriteRows = [];

		console.log("before search");
		if (searchResults !== undefined) {
			for (var i = 0; i < searchResults.length; i++) {
				let cell = [];
				let cellID = `cell-0-${i}`;

				let searchResult = searchResults[i];

				cell.push(<td key={cellID + '-0'}>{searchResult.name}</td>);
				cell.push(<td key={cellID + '-1'}>{searchResult.language}</td>);
				cell.push(<td key={cellID + '-2'}>{searchResult.latestTag}</td>);
				cell.push(<td key={cellID + '-3'}>{searchResult.isFavourite === true ? '' : <a onClick={() => this.addToFavorites(searchResult)}>Add</a>}</td>);
				
				searchRows.push(<tr key={cellID}>{cell}</tr>);
			}
		}
		console.log("after search");

		console.log("before favorites");
		if (favorites !== undefined) {
			console.log("favorites length: " + favorites.length);
			for (var j = 0; j < favorites.length; j++) {
				console.log("j: " + j);
				let cell = [];
				let cellID = `cell-1-${j}`;

				let favorite = favorites[j];

				cell.push(<td key={cellID + '-0'}>{favorite.name}</td>);
				cell.push(<td key={cellID + '-1'}>{favorite.language}</td>);
				cell.push(<td key={cellID + '-2'}>{favorite.latestTag}</td>);
				cell.push(<td key={cellID + '-3'}>{favorite.isFavourite === true ? <a onClick={() => console.log("Removing: " + favorite)}>Remove</a> : '' }</td>);//this.removeFromFavorites(repo)}>Remove</a> : '' }</td>);
				
				favoriteRows.push(<tr key={cellID}>{cell}</tr>);
			}
		}
		console.log("after favorites");

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
