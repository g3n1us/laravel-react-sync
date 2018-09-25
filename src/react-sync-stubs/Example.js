import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ModelComponent, MasterComponent, Alert, Pagination } from 'laravel-react-sync';

export default class Example extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Example Component</div>

                            <div className="card-body">
                                I am an example component!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
