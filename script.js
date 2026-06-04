class FlipBook{
    constructor(bookElem){
        this.elems={
            book:bookElem,
            leaves:bookElem.querySelectorAll(".leaf"),
            buttons:{
                next:document.getElementById("nextPage"),
                prev:document.getElementById("prevPage")
            },
            burstField:document.getElementById("burstField")
        };
        this.currentPagePosition = 0;
        this.activeLeafIndex = null;
        this.isAnimating = false;
        this.animationTimer = null;
        this.setupEvents();
        this.renderPages();
    }

    getLeafZIndex(position, index){
        const totalLeaves = this.elems.leaves.length;

        if(index === this.activeLeafIndex){
            return totalLeaves + 1;
        }

        return position < 0 ? index + 1 : totalLeaves - index;
    }

    setPagePosition(page, position, index){
        let transform = "translate3d(0,0," + ((position < 0 ? 1 : -1) * Math.abs(index)) + "px)";

        if(position < 0){
            transform += " rotate3d(0,1,0,-180deg)";
            page.classList.add("turned");
        }else{
            page.classList.remove("turned");
        }

        page.style.zIndex = this.getLeafZIndex(position, index);

        if(page.style.transform !== transform){
            page.style.transform = transform;
        }
    }

    renderPages(){
        this.elems.leaves.forEach((page, index)=>{
            this.setPagePosition(page, index - this.currentPagePosition, index);
        });

        this.updateButtons();
    }

    updateButtons(){
        this.elems.buttons.prev.disabled = this.isAnimating || this.currentPagePosition === 0;
        this.elems.buttons.next.disabled = this.isAnimating || this.currentPagePosition === this.elems.leaves.length;
    }

    createPageBurst(){
        if(!this.elems.burstField){
            return;
        }

        const totalItems = 10;

        for(let i = 0; i < totalItems; i++){
            const item = document.createElement(i % 3 === 0 ? "span" : "i");
            const x = (Math.random() * 280 - 140).toFixed(0) + "px";
            const y = (Math.random() * -170 - 70).toFixed(0) + "px";
            const rotate = (Math.random() * 180 - 90).toFixed(0) + "deg";

            item.className = i % 3 === 0 ? "burst-heart" : "burst-petal";
            item.style.setProperty("--burst-x", x);
            item.style.setProperty("--burst-y", y);
            item.style.setProperty("--burst-rotate", rotate);

            if(item.className === "burst-heart"){
                item.textContent = "♡";
            }

            this.elems.burstField.appendChild(item);
            item.addEventListener("animationend", ()=> item.remove(), { once:true });
        }
    }

    turnPage(delta){
        if(this.isAnimating && delta !== 0){
            return;
        }

        const nextPagePosition = Math.max(0, Math.min(this.elems.leaves.length, this.currentPagePosition + delta));

        if(nextPagePosition === this.currentPagePosition && delta !== 0){
            return;
        }

        if(delta !== 0){
            this.activeLeafIndex = delta > 0 ? this.currentPagePosition : nextPagePosition;
            this.isAnimating = true;
            this.createPageBurst();
        }

        this.currentPagePosition = nextPagePosition;
        this.renderPages();

        if(delta !== 0){
            clearTimeout(this.animationTimer);
            this.animationTimer = setTimeout(()=>{
                this.activeLeafIndex = null;
                this.isAnimating = false;
                this.renderPages();
            }, 1000);
        }
    }

    setupEvents(){
        this.elems.buttons.next.addEventListener("click", ()=>{
            this.turnPage(1);
        });

        this.elems.buttons.prev.addEventListener("click", ()=>{
            this.turnPage(-1);
        });
    }
}

function setupMusic(){
    const button = document.getElementById("musicToggle");
    const audio = document.getElementById("bgMusic");

    if(!button || !audio){
        return;
    }

    // Cargar la música
    audio.src = "src/Akaza's Love Theme - Demon Slayer_ Infinity Castle OST (Piano Cover Version).mp3";

    button.addEventListener("click", async ()=>{
        if(audio.paused){
            try{
                await audio.play();
                button.classList.add("is-playing");
                button.classList.remove("has-error");
                button.setAttribute("aria-label", "Pausar musica");
            }catch(error){
                console.error("Error al reproducir audio:", error);
                button.classList.add("has-error");
                button.setAttribute("aria-label", "Agrega musica.mp3 para activar la musica");
            }
        }else{
            audio.pause();
            button.classList.remove("is-playing");
            button.setAttribute("aria-label", "Activar musica");
        }
    });
}

var flipBook = new FlipBook(document.getElementById("flipbook"));
setupMusic();
