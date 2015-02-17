/*
 * From princeton algs4
 */
function MinPQ(comparator){
    return {
        pq : [],                     // store items at indices 1 to N
        N : -1,                // number of items on priority queue
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
                this.pq[this.N] = x;
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
            console.log(this.pq);
            this.exch(0, this.N);
            min = this.pq.pop();//[this.N];
            this.N--;
            this.sink(0);
            //this.pq[this.N+1] = null;

            return min;
        },


       /***********************************************************************
        * Helper functions to restore the heap invariant.
        **********************************************************************/

        swim : function(k) {
            while (k > 0 && this.greater(round(k/2), k)) {
                this.exch(k, round(k/2));
                k = k/2;
            }
        },

        sink : function(k) {
            while (2*k <= this.N) {
                j = 2*k;
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
                return this.comparator(this.pq[i], this.pq[j]) > 0;
        },

        exch : function(i, j) {
            swap = this.pq[i];
            this.pq[i] = this.pq[j];
            this.pq[j] = swap;
        },
        // is subtree of pq[1..N] rooted at k a min heap?
        isMinHeap : function(k) {
            if (k > this.N) return true;
            left = 2*k;
            right = 2*k + 1;
            if (left  <= this.N && this.greater(k, left))  return false;
            if (right <= this.N && this.greater(k, right)) return false;
            return (this.isMinHeap(left) && this.isMinHeap(right));
        }
    };
};
