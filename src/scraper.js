module.exports = class Scraper {
    constructor() {
        this.url = 'http://localhost:3000';
        this.redirections = [];
        window.open = url => this.redirections.push(url);
        this.LINKS = 'Go to link';
        this.config = this.helper((s, i) => i ? `[aria-label='${s}']` : 'img');
        this.expandContainer(this.findContainer().parentElement)
    }

    expandContainer({ parentElement: {children} }, prevLength) {
        if (prevLength === children.length) {
            this.createPost([...children]);
        } else {
            const prevLength = children.length;
            window.scroll(0, prevLength * 1000);
            setTimeout(() => {
                this.expandContainer(this.findContainer(), prevLength);
            }, 3000);
        }
    }

    createPost(notes) {
        const post = notes.map(node => {
            const note = this.helper(key => this.getText(this.DOM(this.config[key], node)));
            this.simulateMouseEvent(this.DOM(this.config[this.LINKS], node));
            note[this.LINKS] = this.redirections.splice(-this.redirections.length);
            return note;
        });
        this.fetch(post);
    }

    helper(fn) {
        return ['Images', 'Title', 'Note', this.LINKS]
            .reduce((a, v, i) => ({ ...a, ...{ [v]: fn(v, i) } }), {});
    }

    findContainer() {
        return [...Array(100).keys()].reverse()
            .map(n => this.DOM(`div:nth-child(${n})`).pop()).find(Boolean);
    }

    DOM(selector, node = document.body) {
        return [...node.querySelectorAll(selector)];;
    }

    getText(collection) {
        return collection.map(({innerText, src}) => innerText || src).filter(Boolean);
    }

    simulateMouseEvent(links) {
        links.forEach(link => ["mousedown", "mouseup"].forEach(eventType => {
            const clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            link.dispatchEvent(clickEvent);
        }));
    }

    fetch(data) {
        fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(data.splice(0, 50)),
            headers: { 'Content-Type': 'application/json' }
        }).then(r => console.error(r)).catch(e => console.error(e));

        return data.length && this.fetch(data);
    }
}
