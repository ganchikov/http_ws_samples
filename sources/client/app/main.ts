import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule, Component} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {HttpService} from './http-service';
import {WebSocketService} from './ws-observable-service';


@Component({
    selector: 'socket-observer', 
    providers: [WebSocketService], 
    template:   `<h1>Web Socket Tester</h1>
                <form #f="ngForm" (ngSubmit)="sendMessageToServer(f.value)">
                    <label for="message">Enter message to send to server</label>
                    <input id="message" type="string" name="messageToServer" ngModel>
                    <button type="submit">Send message</button>
                </form>
                <br>
                <label>Received a message from server:</label>
                {{messageFromServer}}<br>
                `
})
class SocketComponent {
    messageFromServer: string;

    constructor (private service: WebSocketService) {
        this.service.createObservableSocket("ws://localhost:8085")
            .subscribe(
                data => {
                    this.messageFromServer = data;
                },
                err => console.log (err),
                () => console.log ('The observable stream is complete')
            );
    }

    sendMessageToServer(formValue) {
        this.service.sendMessage(formValue.messageToServer);
    }
}

@Component({
    selector: 'http-client',
    providers: [HttpService],
    template: `<h1>All ProductsX</h1>
    <form #f="ngForm" (ngSubmit)="getProductByID(f.value)">
        <label for="productID">Enter Product ID</label>
        <input id="productID" type="number" name="productID" ngModel>
        <button type="submit">Find Product</button>
    </form>
    <h4>{{productTitle}} {{productPrice}}</h4>
    <socket-observer></socket-observer>
    `
})
class AppComponent {
    productTitle: string;
    productPrice: string;



    constructor (private service: HttpService) {
        
    }

    getProductByID(formValue){
        this.service.getProductByID(formValue.productID)
            .subscribe(
                data => {this.productTitle = data.title;
                        this.productPrice = `$` + data.price;},
                err => console.log("Can't get product details. Error code: %s, URL: %s ", err.status, err.url),
                () => console.log('Done')
            );
    }

}

@NgModule(
    {
        imports: [BrowserModule, FormsModule, HttpModule],
        declarations: [AppComponent, SocketComponent],
        bootstrap: [AppComponent]
    }
)
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);