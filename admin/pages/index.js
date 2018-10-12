import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Head from 'next/head'
import theme from '../static/theme.json';
import Overlay from '../components/overlay';
import Map from '../components/map';

class App extends React.PureComponent {
    state = {
        addresses: undefined,
        currentAddress: undefined,
        editedLocations: {},
        showApproved: false,
    };

    componentDidMount() {
        let that = this;
        fetch('http://localhost:3001/get')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                console.log(responseAsJson)
                that.setState({editedLocations: responseAsJson})
            });
        fetch('/static/crawler-result-with-locale.json')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ addresses: responseAsJson })
            });
    }

    handleMarkerClick = (key, address) => {
        this.setState({ currentAddress: {key, address}})
    };

    toggleView = () => {
        this.setState({
            showApproved: !this.state.showApproved
        })
    }

    approve = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/add/approved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState({editedLocations: responseAsJson})
        });
    };

    undoApprove = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/remove/approved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState({editedLocations: responseAsJson})
        });
    };

    disapprove = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/add/disapproved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({editedLocations: responseAsJson})
            });
    };

    undoDisapprove = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/remove/disapproved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({editedLocations: responseAsJson})
            });
    };

    render() {
        return (
            <div>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta charSet="utf-8" />
                </Head>
                <style jsx global>{`
                  body {
                    font: 11px menlo;
                    color: #222;
                    margin: 0;
                  }
                `}</style>
                <div>
                    <button onClick={this.toggleView}>{this.state.showApproved ? 'Visa alla' : 'Visa godkända'}</button>
                </div>
                <Map
                    onMarkerClick={this.handleMarkerClick}
                    addresses={this.state.addresses}
                    showApproved={this.state.showApproved}
                    editedLocations={this.state.editedLocations}
                />
                <Overlay
                    approve={this.approve}
                    undoApprove={this.undoApprove}
                    disapprove={this.disapprove}
                    undoDisapprove={this.undoDisapprove}
                    currentAddress={this.state.currentAddress}
                    editedLocations={this.state.editedLocations}
                    closeOverlay={() => {
                        this.setState({
                            currentAddress: undefined
                        })
                    }}
                />
            </div>
        )
    }
}

export default () => <App />;