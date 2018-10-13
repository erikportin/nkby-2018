import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Head from 'next/head'
import theme from '../static/theme.json';
import Overlay from '../components/overlay';
import Map from '../components/map';

class App extends React.PureComponent {
    state = {
        locales: [],
        currentLocale: undefined,
        editedLocales: {},
        localeFilter: 'all',
    };

    componentDidMount() {
        let that = this;
        fetch('http://localhost:3001/get-edited-locales')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                console.log(responseAsJson)
                that.setState({editedLocales: responseAsJson})
            });
        fetch('/static/crawler-result-with-locales.json')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ locales: responseAsJson })
            });
    }

    setCurrentLocale = (name, locale) => {
        this.setState({ currentLocale: name && locale ? {name, locale} : undefined})
    };

    setLocaleFilter = (type) => {
        this.setState({
            localeFilter: type
        })
    }

    approve = ({name, pageUrl}) => {
        let that = this;
        fetch('http://localhost:3001/add/approved-page-url', {
            method: 'post',
            body: JSON.stringify({
                name, pageUrl
            })
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState({editedLocales: responseAsJson})
        });
    };

    undoApprove = ({name, pageUrl}) => {
        let that = this;
        fetch('http://localhost:3001/remove/approved-page-url', {
            method: 'post',
            body: JSON.stringify({
                name, pageUrl
            })
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState({editedLocales: responseAsJson})
        });
    };

    disapprove = ({name, pageUrl}) => {
        let that = this;
        fetch('http://localhost:3001/add/disapproved-page-url', {
            method: 'post',
            body: JSON.stringify({
                name, pageUrl
            })
        })
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({editedLocales: responseAsJson})
            });
    };

    undoDisapprove = ({name, pageUrl}) => {
        let that = this;
        fetch('http://localhost:3001/remove/disapproved-page-url', {
            method: 'post',
            body: JSON.stringify({
                name, pageUrl
            })
        })
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({editedLocales: responseAsJson})
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
                {!this.state.currentLocale && <div style={{
                    position: 'fixed',
                    zIndex: 1
                }}>
                    <button disabled={this.state.localeFilter === 'approved'} onClick={() => {
                        this.setLocaleFilter('approved')
                    }}>{'Visa godkända'}</button>
                    <button disabled={this.state.localeFilter === 'unedited'} onClick={() => {
                        this.setLocaleFilter('unedited')
                    }}>{'Visa oediterade'}</button>
                    <button disabled={this.state.localeFilter === 'all'} onClick={() => {
                        this.setLocaleFilter('all')
                    }}>{'Visa alla'}</button>
                </div>}
                <Map
                    onMarkerClick={this.setCurrentLocale}
                    locales={this.state.locales}
                    localeFilter={this.state.localeFilter}
                    editedLocales={this.state.editedLocales}
                />
                <Overlay
                    approve={this.approve}
                    undoApprove={this.undoApprove}
                    disapprove={this.disapprove}
                    undoDisapprove={this.undoDisapprove}

                    currentLocale={this.state.currentLocale}
                    editedLocales={this.state.editedLocales}
                    setCurrentLocale={this.setCurrentLocale}
                />
            </div>
        )
    }
}

export default () => <App />;