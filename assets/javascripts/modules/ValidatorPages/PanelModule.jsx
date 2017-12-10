import React from 'react';
import ReactDOM from 'react-dom';
import LinksList from './components/LinksList.jsx';

export default class ValidatorPagesModule {

    constructor(connection, tabId, domNode) {
        this.connection = connection;
        this.tabId = tabId;
        this.mainBlockNode = domNode;
        this.linksList = [];
        this.pageInfo = {};

        this.handleMessage = this.handleMessage.bind(this);
        this.download = this.download.bind(this);
        this.upload = this.upload.bind(this);
        this.addLink = this.addLink.bind(this);
    }

    render() {
        ReactDOM.render(
            <div className="row margin-top-small">
                <div className="col-xs-3">
                    <form>
                        <div className="form-group">
                            <label htmlFor="links_file">Load config</label>
                            <div>
                                <input type="file"
                                       onChange={this.upload}/>
                            </div>
                        </div>
                    </form>

                    <button onClick={this.download} className="btn btn-primary btn-lg">
                        <i className="glyphicon glyphicon-download"></i> Save config
                    </button>
                    <br/>
                    <button onClick={this.addLink} className="btn btn-success btn-lg">
                        <i className="glyphicon glyphicon-plus"></i> Add link
                    </button>

                </div>
                <div className="col-xs-3">
                    <h5><strong>Count of links:</strong> {this.linksList.length}</h5>
                    <LinksList links={this.linksList}/>
                </div>
            </div>
            ,
            this.mainBlockNode,
        );
    }

    handleMessage(message) {
        switch (message.name) {
            case 'pageInfo':
                this.pageInfo = message.pageInfo;
                break;
        }
        this.render();
    }

    upload(event) {
        let $this = this;
        let files = event.target.files;
        let reader = new FileReader();

        $this.linksList = [];

        reader.onload = function (e) {
            let listFile = JSON.parse(e.target.result);
            listFile['pages'].forEach(function (page) {
                $this.linksList.push(page['url']);
            });
            $this.render();
        };

        reader.readAsText(files[0]);
    }

    download(event) {
        let textToWrite = JSON.stringify({
            version: 1,
            pages: this.linksList.map(function (url) {
                return {url: url};
            }),
        });
        let textFileAsBlob = new Blob([textToWrite],
            {type: 'application/json'});
        //
        let downloadLink = document.createElement('a');
        downloadLink.download = 'linksConfig.json';
        downloadLink.href = URL.createObjectURL(
            textFileAsBlob);

        downloadLink.click();
    }

    addLink() {
        if(this.linksList.indexOf(this.pageInfo.url) === -1){
            this.linksList.push(this.pageInfo.url);
        }
        this.render();
    }
}



