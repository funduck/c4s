/*
 * From princeton algs4
 */
function MinPQ(comparator){
    return {
        pq : [],                     // store items at indices 1 to N
        N : 0,                       // number of items on priority queue
        comparator : comparator,     // optional comparator function (a, b), returns a >=< b  --- 1, 0, -1

        isEmpty : function() {
            return this.N == 0;
        },

        size : function() {
            return this.N;
        },

        /**
         * Returns a smallest key on the priority queue.
         */
        min : function() {
            if (this.isEmpty()) {
                console.warn("MinPQ is empty!");
                return null;
            }
            return this.pq[0];
        },

        /**
         * Adds a new key to the priority queue.
         * @param x the key to add to the priority queue
         */
        insert : function(x) {
            this.N++;
            if (this.N >= this.pq.length)
                this.pq.push(x);
            else
                this.pq[this.N - 1] = x;
            // add x, and percolate it up to maintain heap invariant
            this.swim(this.N);
        },

        /**
         * Removes and returns a smallest key on the priority queue.
         * @return a smallest key on the priority queue
         * @throws java.util.NoSuchElementException if the priority queue is empty
         */
        delMin : function() {
            if (this.isEmpty()){
                console.warn("MinPQ is empty!");
                return null;
            }
            this.exch(1, this.N);
            var min = this.pq.pop();//[this.N-1];
            this.N--;
            this.sink(1);
            //this.pq[this.N] = null;

            return min;
        },


       /***********************************************************************
        * Helper functions to restore the heap invariant.
        **********************************************************************/

        swim : function(k) {
            while (k > 1 && this.greater(round(k/2), k)) {
                this.exch(k, round(k/2));
                k = round(k/2);
            }
        },

        sink : function(k) {
            while (2*k <= this.N) {
                var j = 2*k;
                if (j < this.N && this.greater(j, j+1)) j++;
                if (!this.greater(k, j)) break;
                this.exch(k, j);
                k = j;
            }
        },

       /***********************************************************************
        * Helper functions for compares and swaps.
        **********************************************************************/
        greater : function(i, j) {
                return this.comparator(this.pq[i-1], this.pq[j-1]) > 0;
        },

        exch : function(i, j) {
            var swap = this.pq[i-1];
            this.pq[i-1] = this.pq[j-1];
            this.pq[j-1] = swap;
        },
        // is subtree of pq[1..N] rooted at k a min heap?
        isMinHeap : function(k) {
            if (k > this.N) return true;
            var left = 2*k;
            var right = 2*k + 1;
            if (left  <= this.N && this.greater(k, left))  return false;
            if (right <= this.N && this.greater(k, right)) return false;
            return (this.isMinHeap(left) && this.isMinHeap(right));
        }
    };
};

testMinPQ = function(){
    pq = MinPQ(function(a,b){
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
    });

    for (var i = 0;i < 10;i++)
        pq.insert(11 - i);

    console.log("test MinPQ ",pq.pq);
    console.log("test MinPQ, delMin(): ",pq.delMin());
}