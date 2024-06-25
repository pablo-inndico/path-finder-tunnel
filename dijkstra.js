class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(priority, value) {
        this.elements.push({ priority, value });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().value;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function dijkstraWithFallback(graph, defaultPath) {
    const start = defaultPath[0];
    const end = defaultPath[defaultPath.length - 1];

    function isDefaultPathValid() {
        for (let i = 0; i < defaultPath.length - 1; i++) {
            const currentNode = defaultPath[i];
            const nextNode = defaultPath[i + 1];
            if (!graph[currentNode] || !graph[currentNode][nextNode]) {
                return false;
            }
        }
        return true;
    }

    if (isDefaultPathValid()) {
        return defaultPath;
    }

    const pq = new PriorityQueue();
    pq.enqueue(0, { cost: 0, node: start, path: [] });
    const visited = new Set();

    function pathPriority(path) {
        let countNonDefaultNodes = 0;
        for (const node of path) {
            if (!defaultPath.includes(node)) {
                countNonDefaultNodes++;
            }
        }
        return countNonDefaultNodes;
    }

    while (!pq.isEmpty()) {
        const { cost, node, path } = pq.dequeue();

        if (visited.has(node)) {
            continue;
        }

        visited.add(node);
        const newPath = [...path, node];

        if (node === end) {
            return newPath;
        }

        for (const neighbor in graph[node]) {
            if (!visited.has(neighbor)) {
                const newCost = cost + graph[node][neighbor];
                const priority = pathPriority(newPath);
                pq.enqueue(priority, { cost: newCost, node: neighbor, path: newPath });
            }
        }
    }

    return null; // No path found
}

const sectionsSelected = new Set();
function appendSection(id) {
    sectionsSelected.add(id);
};

function removeSection(id) {
    sectionsSelected.delete(id);
};

function hasSection(id) {
    return sectionsSelected.has(id);
}

function drawSection(mode, id) {
    const element = document.getElementById(id);
    switch (mode) {
        case "remove":
            element.classList.add(mode);
            element.classList.remove("append");
            break;
        case "append":
            element.classList.add(mode);
            element.classList.remove("remove");
            break;
        default:
            break;
    }
}

const hmiContainer = document.getElementById("hmi-container");
hmiContainer.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.nodeName === 'path') {
        if (target?.parentNode?.getAttribute('id') == 'LY-ROUTES') {
            const sectionClicked = target.getAttribute('id');
            if (hasSection(sectionClicked)) {
                removeSection(sectionClicked);
                drawSection("append", sectionClicked);
            } else {
                appendSection(sectionClicked);
                drawSection("remove", sectionClicked);
            }
        }
    }
});

const graph = {
    A: { B: 60, X: 5 },
    B: { C: 527 },
    C: { D: 815 },
    D: { E: 2966, V: 200},
    E: { F: 110, U: 98},
    F: { G: 110, T: 52},
    G: { H: 385 },
    H: { I: 385 },
    I: { J: 200, R: 65},
    J: { K: 3440 },
    K: { L: 3200, P: 41 },
    L: { M: 60 },
    X: { W: 328 },
    W: { C: 160, V: 872 },
    V: { U: 3903, D: 200 },
    U: { T: 80 },
    T: { S: 80 },
    S: { R: 860, G: 100 },
    R: { Q: 94 },
    Q: { P: 1056, J: 50 },
    P: { O: 3050 },
    O: { M: 3050 },
};

// const graph = {
//     A: {B:60},
//     B: {A:60,C:527,W:5},
//     C: {B:527,D:815},
//     D: {C:815,E:45,UP:100},
//     UP:{D:100,U:100},
//     E: {D:45,F:1420},
//     F: {E:1420,G:500},
//     G: {F:500,H:240},
//     H: {G:240,Q:45,I:385},
//     I: {H:385,J:385},
//     J: {H:740,I:385},
//     K: {J:200,L:3420,P:160},
//     L: {K:3420,M:3220,O:20},
//     M: {L:3220,N:5},
//     N: {M:5,O:3050},
//     O: {N:3050,P:1150,L:20},
//     P: {O:1150,Q:860,K:160},
//     Q: {P:860,R:190,H:45},
//     R: {Q:190,S:772},
//     S: {R:772,T:1090},
//     T: {S:1090,U:2041},
//     U: {T:2041,V:872,UP:100},
//     V: {U:872,W:328},
//     W: {V:328,X:60},
//     X: {W:60},
// }

// Predefined path
const defaultPath = [ 'A','B', 'C','D','E','F','G','H','J','K','M'];
const path = dijkstraWithFallback(graph, defaultPath);

function drawGraph(path) {
    if (!path) return;
    // const title = document.getElementById("path-definition");
    // title.textContent = JSON.stringify(path);
    for (let index = 0; index < path?.length; index++) {
        const idNode = path[index];

        // DRAW NODES
        const node1 = document.getElementById(idNode);
        const node2 = document.getElementById(idNode + 2);

        if (node1)  node1.style.strokeOpacity = "0.8";
        if (node2)  node2.style.strokeOpacity = "0.8";
       
        // DRAW ARISTAS
        const nextIndex = index + 1;
        if (nextIndex > path.length - 1) continue;        
        const nextIdNode = path[nextIndex];

        let idArista = `${nextIdNode}${idNode}`;
        let arista1 = document.getElementById(idArista);
        let arista2 = document.getElementById(idArista + '2');

        if (arista1) {
            arista1.style.strokeOpacity = "0.8";
        } else {
            idArista = `${idNode}${nextIdNode}`;
            arista1 = document.getElementById(idArista);
            if (arista1) arista1.style.strokeOpacity = "0.8";;
        } 
        if (arista2) {
            arista2.style.strokeOpacity = "0.8";
        } else {
            idArista = `${idNode}${nextIdNode}2`;
            arista2 = document.getElementById(idArista);
            if (arista2) arista2.style.strokeOpacity = "0.8";;
        }
    }
}

drawGraph(path);
