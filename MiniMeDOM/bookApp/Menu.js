export class Menu
  extends HTMLElement {

  makeLink(pos, title) {
    let a = document.createElement("a");
    let b = document.createElement("a");
    pos.length === 1 ? this.a = document.createElement("a") : this.b = document.createElement("a");
    pos.length === 1 ? this.a.innerText = "Chapter " + pos[0] + ": " + title : this.b.innerText = pos.join(".") + " " + title;
    pos.length === 1 ? this.a.className = "mainchapter" : this.b.className = "subchapter";
    pos.length === 1 ? this.a.href = "#chapter" + pos.join(".") : this.b.href = "#chapter" + pos.join(".");
    pos[0] === 1 ? this.a.setAttribute("active", "") : "";  //show subchapters from 1 mainchapters by default
    pos.length === 2 ? this.a.appendChild(this.b) : "";
    return this.a;

  }

  appendChildren(flatChapters) {
    this.innerHTML = "";
    const lis = flatChapters.map(([pos, title]) => this.makeLink(pos, title));
    lis.forEach(li => this.appendChild(li));
  }
}

customElements.define("book-menu", Menu);
