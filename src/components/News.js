import React, { Component } from "react";
import Newsitem from "./Newsitem";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

   capitalizeFirstLetter=(string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults:0
    };
    document.title=`${this.capitalizeFirstLetter(this.props.category)}-News Today`;
  }

  async updateNews(pageNo){
// const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=dbe57b028aeb41e285a226a94865f7a7&page=${this.state.page}&pageSize=${this.props.pageSize}`;
const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9dd18fa372b640c2bb961a27dfcf6eeb&page=${this.state.page}&pageSize=${this.props.pageSize}`;
this.setState({ loading: true });
let data = await fetch(url);
let parsedData = await data.json()
this.setState({
articles: parsedData.articles,
totalResults: parsedData.totalResults,
loading: false
})
}


  async componentDidMount() {
    this.updateNews();
  }

  handlePrevclick = async () => {
    this.setState({page: this.state.page - 1});
    this.updateNews();
  }

  handleNextclick = async () => {
    this.setState({page: this.state.page + 1});
    this.updateNews();
  }

  fetchMoreData = async () =>{
    this.setState({page: this.state.page + 1})
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9dd18fa372b640c2bb961a27dfcf6eeb&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      // this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json()
      this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading: false,
      })
    };
    

  render() {
    return (
        <>
        <h2 className="text-center" style={{marginTop:'90px'}}>News Today-Top Headlines</h2>
        <hr></hr>
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<h4>Loading...</h4>}
        >
        <div className="container">
        <div className="row">
          {this.state.articles.map((element) => {
            return (
              <div className="col-md-4 my-3" key={element.url}>
                <Newsitem
                  title={element.title}
                  description={element.description}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
          </div>
          </div>
          </InfiniteScroll>
          </>
      // </div>
    );
  }
}
