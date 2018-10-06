import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Head from 'next/head'

const GooglMapWrapper = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh`, width: '100%' }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: 63.5217687, lng: 22.5216011 }}
    >
        {props.addresses && Object.keys(props.addresses).map((key) => {
            const address = props.addresses[key];

            if(address.locale){
                return <Marker
                    key={key} position={address.locale} onClick={() => {
                        props.onMarkerClick(key, address)
                    }}
                    label={address.pages.length.toString()}
                />
            }

            return null;
        })}
    </GoogleMap>
);

class Map extends React.PureComponent {
    state = {
        addresses: undefined,
        currentAddress: undefined
    };

    componentDidMount() {
        let that = this;

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
                <GooglMapWrapper
                    onMarkerClick={this.handleMarkerClick}
                    addresses={this.state.addresses}
                />
                {this.state.currentAddress && <div style={{
                    position: 'absolute',
                    top: '0',
                    backgroundColor: '#ffffffbd',
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    padding: '10px',
                    boxSizing: 'border-box'

                }}>
                    <h1 style={{
                        textAlign: 'center',
                        textTransform: 'capitalize'
                    }}>{this.state.currentAddress.key}</h1>
                    <ul style={{
                        padding: 0,
                        margin: 0
                    }}>
                        {this.state.currentAddress.address.pages.map((page, i) => {
                            return (
                                <li key={i} style={{
                                    listStyle: 'none',
                                    width: '50%',
                                    float: 'left',
                                    marginBottom: '10px'
                                }}>
                                    {page.images.length > 0 && <img src={`http://www.nykarlebyvyer.nu/${page.images[0].replace('../../../', '')}`} alt="" width="100px"/>}
                                    <br/>
                                    <a href={page.url} target="_blank">{page.title || page.url}</a>
                                </li>
                            )
                        })}
                    </ul>
                    <button onClick={() => {
                        this.setState({
                            currentAddress: undefined
                        })
                    }} style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px'
                    }}>Stäng</button>
                </div>}
            </div>
        )
    }
}

export default () => <Map />;