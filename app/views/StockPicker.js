import React, { useState } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

import Main from "../layouts/Main";

import StockPickerFetcher from "../components/StockPicker/StockPickerFetcher";

class StockPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockPickerFetcherButton: false,
    };
    this.stockPickerFetcherButtonOnClick =
      this.stockPickerFetcherButtonOnClick.bind(this);
  }

  stockPickerFetcherButtonOnClick() {
    this.setState({
      stockPickerFetcherButton: true,
    });
  }

  render() {
    return (
      <Main>
        <Helmet title="StockPicker" />
        <article className="post" id="StockPickerArticleId">
          <header>
            <div className="title">
              <h2>
                <Link to="/stockpicker">Stock Picker</Link>
              </h2>
              <p id="StockPickerInfo">
                Press the button below to get a list of stocks picked by my
                self-made AI machine!
              </p>
              <p id="StockPickerDisclaimer">
                Disclaimer: Not financial advice.
              </p>
              <button
                id="StockPickerFetcherButtonId"
                onClick={this.stockPickerFetcherButtonOnClick}
              >
                Get stock picks
              </button>
            </div>
          </header>
          {/* Fetch stock picks only if they've clicked the button */}
          {this.state.stockPickerFetcherButton && <StockPickerFetcher />}
        </article>
      </Main>
    );
  }
}

export default StockPicker;
