class H{
    static genid(){
        let r = Math.random().toString(36).substring(7);
        return r
    }

    static _(node, identifier){
        return node.querySelector(identifier);
    }

    static d(id){
        return document.querySelector(id)
    }

    static n(name){
        return document.getElementsByName(name);
    }
}