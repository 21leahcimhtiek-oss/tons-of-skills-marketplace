class l{stack=[];STORAGE_KEY="ccp-plugin-stack";constructor(){this.loadFromURL(),this.loadFromStorage(),this.initializeEventListeners(),this.restoreCheckboxStates(),this.updateUI()}loadFromURL(){try{const t=new URLSearchParams(window.location.search).get("stack");if(t){const s=t.split(",").map(a=>a.trim()).filter(Boolean);setTimeout(()=>{s.forEach(a=>{const n=document.querySelector(`.stack-select[data-plugin-name="${a}"]`);n&&!n.checked&&(n.checked=!0,n.dispatchEvent(new Event("change",{bubbles:!0})))})},100)}}catch(e){console.error("Failed to load from URL:",e)}}loadFromStorage(){try{const e=localStorage.getItem(this.STORAGE_KEY);e&&(this.stack=JSON.parse(e))}catch{this.stack=[]}}saveToStorage(){try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify(this.stack))}catch(e){console.error("Failed to save stack:",e)}}initializeEventListeners(){document.addEventListener("change",e=>{const t=e.target;if(t.classList.contains("stack-select")){const s=t,a=s.dataset.pluginName;s.checked?this.addToStack(a):this.removeFromStack(a)}}),document.getElementById("clear-stack")?.addEventListener("click",()=>{this.clearStack()}),document.getElementById("copy-commands")?.addEventListener("click",()=>{this.copyCommands()}),document.getElementById("share-stack")?.addEventListener("click",()=>{this.shareStack()})}addToStack(e){const t=document.querySelector(`.plugin-card[data-name="${e}"]`);if(!t)return;const s={name:e,category:t.getAttribute("data-category")||"",installation:t.getAttribute("data-installation")||""};this.stack.find(a=>a.name===e)||(this.stack.push(s),this.saveToStorage(),this.updateUI(),window.trackEvent&&window.trackEvent("stack_action",{action:"add",plugin_name:e}))}removeFromStack(e){this.stack=this.stack.filter(t=>t.name!==e),this.saveToStorage(),this.updateUI(),window.trackEvent&&window.trackEvent("stack_action",{action:"remove",plugin_name:e})}clearStack(){this.stack=[],this.saveToStorage(),document.querySelectorAll(".stack-select").forEach(e=>{e.checked=!1}),this.updateUI(),window.trackEvent&&window.trackEvent("stack_action",{action:"clear"})}restoreCheckboxStates(){this.stack.forEach(e=>{const t=document.querySelector(`.stack-select[data-plugin-name="${e.name}"]`);t&&(t.checked=!0)})}updateUI(){const e=document.getElementById("stack-builder"),t=document.getElementById("stack-count"),s=document.getElementById("stack-empty"),a=document.getElementById("stack-items"),n=document.getElementById("stack-footer");!e||!t||!s||!a||!n||(t.textContent=this.stack.length.toString(),this.stack.length>0?(e.classList.add("active"),s.style.display="none",a.classList.add("has-items"),n.classList.add("active"),a.innerHTML=this.stack.map(c=>`
          <div class="stack-item">
            <div class="stack-item-info">
              <div class="stack-item-name">${c.name}</div>
              <div class="stack-item-category">
                ${c.category.split("-").map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" ")}
              </div>
            </div>
            <button class="stack-item-remove" data-plugin-name="${c.name}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        `).join(""),a.querySelectorAll(".stack-item-remove").forEach(c=>{c.addEventListener("click",o=>{const i=o.currentTarget.dataset.pluginName,r=document.querySelector(`.stack-select[data-plugin-name="${i}"]`);r&&(r.checked=!1),this.removeFromStack(i)})})):(e.classList.remove("active"),s.style.display="flex",a.classList.remove("has-items"),n.classList.remove("active")))}copyCommands(){const e=this.stack.map(t=>t.installation).join(`
`);navigator.clipboard.writeText(e).then(()=>{const t=document.getElementById("copy-commands");if(t){const s=t.innerHTML;t.innerHTML=`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
            </svg>
            Copied ${this.stack.length} Commands!
          `,setTimeout(()=>{t.innerHTML=s},2e3)}window.trackEvent&&window.trackEvent("stack_action",{action:"copy",count:this.stack.length})})}shareStack(){if(this.stack.length===0)return;const e=this.stack.map(a=>a.name).join(","),s=`${window.location.origin+window.location.pathname}?stack=${encodeURIComponent(e)}`;navigator.clipboard.writeText(s).then(()=>{const a=document.getElementById("share-stack");if(a){const n=a.innerHTML;a.innerHTML=`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
            </svg>
            Link Copied!
          `,setTimeout(()=>{a.innerHTML=n},2e3)}this.showToast(`Shareable link copied! (${this.stack.length} plugins)`),window.trackEvent&&window.trackEvent("stack_action",{action:"share",count:this.stack.length})}).catch(()=>{alert(`Share this link:

${s}`)})}showToast(e){const t=document.createElement("div");t.className="share-toast",t.textContent=e,t.style.cssText=`
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: var(--brand-dark);
        padding: 1rem 1.5rem;
        border-radius: 0;
        font-weight: 600;
        font-size: 0.875rem;
        
        z-index: 10000;
        animation: toast-slide-up 0.3s ease;
      `,document.body.appendChild(t),setTimeout(()=>{t.style.animation="toast-slide-down 0.3s ease",setTimeout(()=>{document.body.removeChild(t)},300)},3e3)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new l}):new l;
