import React from "react";
// import MaterialTable from "@material-table/core";

class StockPickerFetcher extends React.Component {
  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      stockPickerData: [],
      stockPickerDataLoaded: false,
    };
  }

  componentDidMount() {
    // fetch("https://jsonplaceholder.typicode.com/users")
    //   .then((res) => res.json())
    //   .then((json) => {
    //     this.setState({
    //       stockPickerData: json,
    //       stockPickerDataLoaded: true,
    //     });
    //   });
  }
  render() {
    // const { stockPickerDataLoaded, stockPickerData } = this.state;
    // if (!stockPickerDataLoaded) {
    //   return (
    //     <div>
    //       <h1> Retrieving data... </h1>
    //     </div>
    //   );
    // }

    return (
      <div>
        <h1> Coming soon </h1>
      </div>
    );

    // const testColumns = [
    //   { title: "Title", field: "title" },
    //   { title: "Author", field: "authors" },
    //   { title: "Page Count", field: "num_pages" },
    //   { title: "Rating", field: "rating" },
    // ];
    // const testData = [
    //   {
    //     title: "The Hunger Games",
    //     authors: "Suzanne Collins",
    //     num_pages: 374,
    //     rating: 4.33,
    //   },
    //   {
    //     title: "Harry Potter and the Order of the Phoenix",
    //     authors: "J.K. Rowling",
    //     num_pages: 870,
    //     rating: 4.48,
    //   },
    //   {
    //     title: "To Kill a Mockingbird",
    //     authors: "Harper Lee",
    //     num_pages: 324,
    //     rating: 4.27,
    //   },
    // ];

    // return (
    //   <div>
    //     <MaterialTable
    //       columns={testColumns}
    //       data={testData}
    //       title="Books Directory"
    //     />
    //   </div>
    // );

    // return (
    //   <div className="StockPickerFetcher">
    //     {stockPickerData.map((item) => (
    //       <ol key={item.id}>
    //         User_Name: {item.username}, Full_Name: {item.name}, User_Email:{" "}
    //         {item.email}
    //       </ol>
    //     ))}
    //   </div>
    // );
  }
}

export default StockPickerFetcher;
