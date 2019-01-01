module.exports = class Scraper {
    constructor() {
        this.url = 'http://localhost:3000';
        this.textAreas = ['titles', 'messages'];
        this.promises = this.redirections = [];
        window.open = url => this.redirections.push(url);
        this.config = {
            links: 'div[role="link"] div[role="button"]',
            images: 'img',
            [this.textAreas[0]]: 'div[aria-multiline]',
            [this.textAreas[1]]: 'div[aria-multiline]',
        };
        this.expandContainer(this.findContainer())
    }

    expandContainer({ children }, prevLength) {
        if (prevLength === children.length) {
            this.createPost([...children].filter(ch => ch.children.length));
        } else {
            const prevLength = children.length;
            window.scroll(0, prevLength * 1000);
            setTimeout(_ => this.expandContainer(this.findContainer(), prevLength), 3000);
        }
    }

    createPost(notes) {
        this.fetch(notes.map(node => {
            const note = this.helper(key => this.getText(this.DOM(key, node)));
            this.simulateMouseEvent(this.DOM(this.config.links, node));
            note.links = this.redirections.splice(-this.redirections.length);
            return note;
        }));
    }

    helper(fn) {
        return Object.keys(this.config)
            .reduce((a, v, i) => ({ ...a, ...{ [v]: fn(v, i) } }), {});
    }

    findContainer() {
        const byHeight = this.DOM('.notes-container div')
            .filter(({ style: { height } }) => height.includes('px'))
            .reduce((acc, n) => (n.getClientRects()[0].height > acc) ? n : acc, 0);

        return byHeight || [...Array(100).keys()].reverse()
            .map(n => this.DOM(`div:nth-child(${n})`).pop()).find(Boolean).parentElement;
    }

    DOM(string, node = document.body) {
        const selector = this.config[string] || string;
        const children = [...node.querySelectorAll(selector)];
        const index = this.textAreas.indexOf(string);
        if (index === -1)
            return children

        return index ? children.slice(1, children.length) : children.slice(0, 1);
    }

    getText(collection) {
        return collection.map(({ innerText, src }) => innerText || src).filter(Boolean);
    }

    simulateMouseEvent(links) {
        links.forEach(link => ["mousedown", "mouseup"].forEach(eventType => {
            const clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            link.dispatchEvent(clickEvent);
        }));
    }

    fetch(data) {
        this.promises.push(fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(data.splice(0, 50)),
            headers: { 'Content-Type': 'application/json' }
        }));

        return data.length
            ? this.fetch(data)
            : Promise.all(this.promises)
                .then(_ => fetch(this.url))
                .catch(e => console.error(e));
    }
}
