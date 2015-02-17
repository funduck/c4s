function FixedDeepStack(deep){
    return {
        deep : deep,
        cursor : 0,
        objects : [],
        put : function (elem) {
            this.objects.push(elem);
            if (this.objects.length > this.deep)
                this.objects.pop();
            this.cursor = this.objects.length;
            //console.log("FixedDeepStack: " + this.objects);
        },
        next : function () {
            //console.log("FixedDeepStack next " + this.cursor);
            if (this.cursor > 0 && this.objects.length > 0) {
                this.cursor--;
                return this.objects[this.cursor];
            }
            return null;
        },
        prev : function () {
            //console.log("FixedDeepStack prev " + this.cursor);
            if (this.cursor < this.objects.length - 1) {
                this.cursor++;
                return this.objects[this.cursor];
            }
            return null;
        },
        contains : function(obj) {
            for (i in this.objects) {
                if (this.objects[i] == obj) return true;
            }
            return false;
        }   
    };
};