const elemNode = document.createElement('div');

export interface HTMLCustomElement extends HTMLElement {
    value: string | number;
}

class Helpers {
    public elemNodeForRefs: HTMLCustomElement

    constructor() {
        this.elemNodeForRefs = document.createElement('button');
    }

    public hideHeader = ( hide: boolean = true ) => {
        const header = document.getElementById('giftListHeader')
        if ( header ) header.style.display = hide ? 'none' : 'block'
    }

    public parseTime( timeStamp: string | number ) {
        const unixTime = new Date(Date.parse(timeStamp as any))
        return `${unixTime.toLocaleDateString('es-ES')} - ${unixTime.toLocaleTimeString('es-ES')}`
    }
}

const helpers = new Helpers()

export { 
    helpers as HelpersClass
}