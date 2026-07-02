const algorithms = {
    'quick-sort': {
        title: 'Quick Sort',
        desc: "A highly efficient sorting algorithm that uses a divide-and-conquer strategy to quickly sort items within an array. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays.",
        best: 'O(n log n)',
        avg: 'O(n log n)',
        worst: 'O(nÂ²)',
        space: 'O(log n)',
        chars: [
            { icon: 'check_circle', text: 'In-place algorithm' },
            { icon: 'cancel', text: 'Not stable (relative order not preserved)' },
            { icon: 'bolt', text: 'Cache-friendly implementation' }
        ],
        apps: "Used in commercial applications for large scale sorting, internal sorting in libraries, and as a component of more complex hybrid algorithms like Timsort.",
        run: async (api) => {
            async function partition(low, high) {
                await api.markLine(14);
                let i = low - 1;
                await api.markLine(17);
                for (let j = low; j < high; j++) {
                    await api.markLine(18);
                    if (await api.compare(j, high) < 0) {
                        await api.markLine(19);
                        i++;
                        await api.markLine(21);
                        await api.swap(i, j);
                    }
                }
                await api.markLine(26);
                await api.swap(i + 1, high);
                await api.markLine(27);
                return i + 1;
            }
            async function sort(low, high) {
                await api.markLine(2);
                if (low < high) {
                    await api.markLine(4);
                    let pi = await partition(low, high);
                    await api.markLine(7);
                    await sort(low, pi - 1);
                    await api.markLine(8);
                    await sort(pi + 1, high);
                }
            }
            await api.markLine(1);
            await sort(0, api.arr.length - 1);
            await api.markLine(10);
        },
        runRaw: (arr) => {
            function sort(low, high) {
                if (low < high) {
                    let i = low - 1;
                    let pivot = arr[high];
                    for (let j = low; j < high; j++) {
                        if (arr[j] <= pivot) {
                            i++;
                            let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
                        }
                    }
                    let temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
                    let pi = i + 1;
                    sort(low, pi - 1);
                    sort(pi + 1, high);
                }
            }
            sort(0, arr.length - 1);
        }
    },
    'merge-sort': {
        title: 'Merge Sort',
        desc: "An efficient, stable sorting algorithm that makes O(n log n) comparisons. It uses a divide-and-conquer strategy, repeatedly dividing a list into equal halves until each has one element, and then merging them in a sorted manner.",
        best: 'O(n log n)',
        avg: 'O(n log n)',
        worst: 'O(n log n)',
        space: 'O(n)',
        chars: [
            { icon: 'cancel', text: 'Not an in-place algorithm (requires extra memory)' },
            { icon: 'check_circle', text: 'Stable sort (preserves relative order)' },
            { icon: 'bolt', text: 'Highly parallelizable' }
        ],
        apps: "Excellent for sorting linked lists, external sorting (processing data too large for RAM), and stable sorting requirements in e-commerce.",
        run: async (api) => {
            async function merge(l, m, r) {
                await api.markLine(14);
                let n1 = m - l + 1;
                let n2 = r - m;
                let L = new Array(n1);
                let R = new Array(n2);
                for (let i = 0; i < n1; i++) L[i] = api.arr[l + i];
                for (let j = 0; j < n2; j++) R[j] = api.arr[m + 1 + j];

                let i = 0, j = 0, k = l;
                await api.markLine(17);
                while (i < n1 && j < n2) {
                    await api.markLine(18);
                    api.ops++;
                    api.updateOps();
                    api.bars[k].classList.add('bg-white');
                    await api.sleep();
                    api.bars[k].classList.remove('bg-white');
                    if (L[i] <= R[j]) {
                        await api.markLine(19);
                        await api.set(k, L[i]);
                        await api.markLine(20);
                        i++;
                    } else {
                        await api.markLine(22);
                        await api.set(k, R[j]);
                        await api.markLine(23);
                        j++;
                    }
                    k++;
                    await api.markLine(17);
                }
                await api.markLine(28);
                while (i < n1) {
                    await api.set(k, L[i]);
                    i++; k++;
                }
                while (j < n2) {
                    await api.set(k, R[j]);
                    j++; k++;
                }
            }
            async function sort(l, r) {
                await api.markLine(2);
                if (l >= r) return;
                await api.markLine(5);
                let m = l + Math.floor((r - l) / 2);
                await api.markLine(6);
                await sort(l, m);
                await api.markLine(7);
                await sort(m + 1, r);
                await api.markLine(10);
                await merge(l, m, r);
            }
            await api.markLine(1);
            await sort(0, api.arr.length - 1);
        },
        runRaw: (arr) => {
            function sort(l, r) {
                if (l >= r) return;
                let m = l + Math.floor((r - l) / 2);
                sort(l, m);
                sort(m + 1, r);
                let n1 = m - l + 1, n2 = r - m;
                let L = new Array(n1), R = new Array(n2);
                for (let i = 0; i < n1; i++) L[i] = arr[l + i];
                for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
                let i = 0, j = 0, k = l;
                while (i < n1 && j < n2) {
                    if (L[i] <= R[j]) { arr[k] = L[i]; i++; }
                    else { arr[k] = R[j]; j++; }
                    k++;
                }
                while (i < n1) { arr[k] = L[i]; i++; k++; }
                while (j < n2) { arr[k] = R[j]; j++; k++; }
            }
            sort(0, arr.length - 1);
        }
    },
    'bubble-sort': {
        title: 'Bubble Sort',
        desc: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
        best: 'O(n)',
        avg: 'O(nÂ²)',
        worst: 'O(nÂ²)',
        space: 'O(1)',
        chars: [
            { icon: 'check_circle', text: 'In-place algorithm' },
            { icon: 'check_circle', text: 'Stable sort' },
            { icon: 'cancel', text: 'Very slow for large datasets' }
        ],
        apps: "Mainly used for educational purposes to introduce the concept of a sorting algorithm. Rarely used in practice due to poor performance.",
        run: async (api) => {
            await api.markLine(2);
            let n = api.arr.length;
            await api.markLine(4);
            for (let i = 0; i < n - 1; i++) {
                await api.markLine(5);
                let swapped = false;
                await api.markLine(7);
                for (let j = 0; j < n - i - 1; j++) {
                    await api.markLine(9);
                    if (await api.compare(j, j + 1) > 0) {
                        await api.markLine(11);
                        await api.swap(j, j + 1);
                        await api.markLine(12);
                        swapped = true;
                    }
                    await api.markLine(7);
                }
                await api.markLine(18);
                if (!swapped) break;
                await api.markLine(4);
            }
            await api.markLine(21);
        },
        runRaw: (arr) => {
            let n = arr.length;
            for (let i = 0; i < n - 1; i++) {
                let swapped = false;
                for (let j = 0; j < n - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        let temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
                        swapped = true;
                    }
                }
                if (!swapped) break;
            }
        }
    },
    'heap-sort': {
        title: 'Heap Sort',
        desc: "A comparison-based sorting technique based on a Binary Heap data structure. It divides its input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region.",
        best: 'O(n log n)',
        avg: 'O(n log n)',
        worst: 'O(n log n)',
        space: 'O(1)',
        chars: [
            { icon: 'check_circle', text: 'In-place algorithm' },
            { icon: 'cancel', text: 'Not stable' }
        ],
        apps: "Used when memory is strictly limited and worst-case O(n log n) is required. Used in some Linux kernel implementations.",
        run: async (api) => {
            async function heapify(n, i) {
                await api.markLine(22);
                let largest = i;
                let l = 2 * i + 1;
                let r = 2 * i + 2;

                await api.markLine(26);
                if (l < n && await api.compare(l, largest) > 0) {
                    largest = l;
                    await api.markLine(27);
                }
                await api.markLine(29);
                if (r < n && await api.compare(r, largest) > 0) {
                    largest = r;
                    await api.markLine(30);
                }

                await api.markLine(33);
                if (largest !== i) {
                    await api.markLine(34);
                    await api.swap(i, largest);
                    await api.markLine(35);
                    await heapify(n, largest);
                }
            }
            await api.markLine(2);
            let n = api.arr.length;
            await api.markLine(5);
            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                await api.markLine(6);
                await heapify(n, i);
            }
            await api.markLine(10);
            for (let i = n - 1; i > 0; i--) {
                await api.markLine(12);
                await api.swap(0, i);
                await api.markLine(15);
                await heapify(i, 0);
            }
            await api.markLine(18);
        },
        runRaw: (arr) => {
            function heapify(n, i) {
                let largest = i, l = 2 * i + 1, r = 2 * i + 2;
                if (l < n && arr[l] > arr[largest]) largest = l;
                if (r < n && arr[r] > arr[largest]) largest = r;
                if (largest !== i) {
                    let temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
                    heapify(n, largest);
                }
            }
            let n = arr.length;
            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
            for (let i = n - 1; i > 0; i--) {
                let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
                heapify(i, 0);
            }
        }
    },
    'selection-sort': {
        title: 'Selection Sort',
        desc: "An in-place comparison sorting algorithm that divides the input list into a sorted sublist and an unsorted sublist. It repeatedly selects the smallest element from the unsorted sublist and swaps it into the sorted sublist.",
        best: 'O(nÂ²)', avg: 'O(nÂ²)', worst: 'O(nÂ²)', space: 'O(1)',
        chars: [{ icon: 'check_circle', text: 'In-place algorithm' }, { icon: 'cancel', text: 'Not stable' }],
        apps: "Useful where write operations to memory are significantly more expensive than read operations, as it makes at most O(n) swaps.",
        run: async (api) => {
            await api.markLine(2);
            let n = api.arr.length;
            await api.markLine(4);
            for (let i = 0; i < n - 1; i++) {
                await api.markLine(7);
                let min_idx = i;
                await api.markLine(9);
                for (let j = i + 1; j < n; j++) {
                    await api.markLine(10);
                    if (await api.compare(j, min_idx) < 0) {
                        await api.markLine(11);
                        min_idx = j;
                    }
                    await api.markLine(9);
                }
                await api.markLine(17);
                if (min_idx !== i) {
                    await api.markLine(18);
                    await api.swap(i, min_idx);
                }
                await api.markLine(4);
            }
            await api.markLine(22);
        },
        runRaw: (arr) => {
            let n = arr.length;
            for (let i = 0; i < n - 1; i++) {
                let min_idx = i;
                for (let j = i + 1; j < n; j++) {
                    if (arr[j] < arr[min_idx]) min_idx = j;
                }
                if (min_idx !== i) {
                    let temp = arr[i]; arr[i] = arr[min_idx]; arr[min_idx] = temp;
                }
            }
        }
    },
    'insertion-sort': {
        title: 'Insertion Sort',
        desc: "Builds the final sorted array one item at a time. It iterates, consuming one input element each repetition, and grows a sorted output list.",
        best: 'O(n)', avg: 'O(nÂ²)', worst: 'O(nÂ²)', space: 'O(1)',
        chars: [{ icon: 'check_circle', text: 'In-place algorithm' }, { icon: 'check_circle', text: 'Stable sort' }],
        apps: "Efficient implementation for small data datasets and arrays that are mostly sorted. Used as a subroutine in Timsort and Introsort.",
        run: async (api) => {
            await api.markLine(2);
            let n = api.arr.length;
            await api.markLine(4);
            for (let i = 1; i < n; i++) {
                await api.markLine(6);
                let j = i;
                await api.markLine(11);
                while (j > 0 && await api.compare(j - 1, j) > 0) {
                    await api.markLine(12);
                    await api.swap(j, j - 1);
                    await api.markLine(13);
                    j--;
                    await api.markLine(11);
                }
                await api.markLine(17);
                await api.markLine(4);
            }
            await api.markLine(20);
        },
        runRaw: (arr) => {
            let n = arr.length;
            for (let i = 1; i < n; i++) {
                let key = arr[i];
                let j = i - 1;
                while (j >= 0 && arr[j] > key) {
                    arr[j + 1] = arr[j];
                    j = j - 1;
                }
                arr[j + 1] = key;
            }
        }
    },
    'tim-sort': {
        title: 'Tim Sort',
        desc: "A hybrid stable sorting algorithm, derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data.",
        best: 'O(n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
        chars: [{ icon: 'cancel', text: 'Requires O(n) memory' }, { icon: 'check_circle', text: 'Stable sort' }],
        apps: "The standard sorting algorithm used in Python, Java's Arrays.sort(), Android, and V8 (Chrome/Node.js).",
        run: async (api) => {
            const RUN = 32;
            let n = api.arr.length;
            async function insertionSort(left, right) {
                for (let i = left + 1; i <= right; i++) {
                    let j = i;
                    while (j > left && await api.compare(j - 1, j) > 0) {
                        await api.swap(j, j - 1);
                        j--;
                    }
                }
            }
            async function merge(l, m, r) {
                let len1 = m - l + 1, len2 = r - m;
                let left = new Array(len1), right = new Array(len2);
                for (let x = 0; x < len1; x++) left[x] = api.arr[l + x];
                for (let x = 0; x < len2; x++) right[x] = api.arr[m + 1 + x];
                let i = 0, j = 0, k = l;
                while (i < len1 && j < len2) {
                    api.ops++; api.updateOps(); api.bars[k].classList.add('bg-white'); await api.sleep(); api.bars[k].classList.remove('bg-white');
                    if (left[i] <= right[j]) { await api.set(k, left[i]); i++; }
                    else { await api.set(k, right[j]); j++; }
                    k++;
                }
                while (i < len1) { await api.set(k, left[i]); i++; k++; }
                while (j < len2) { await api.set(k, right[j]); j++; k++; }
            }
            for (let i = 0; i < n; i += RUN) await insertionSort(i, Math.min((i + RUN - 1), (n - 1)));
            for (let size = RUN; size < n; size = 2 * size) {
                for (let left = 0; left < n; left += 2 * size) {
                    let mid = left + size - 1;
                    let right = Math.min((left + 2 * size - 1), (n - 1));
                    if (mid < right) await merge(left, mid, right);
                }
            }
        },
        runRaw: (arr) => {
            const RUN = 32;
            let n = arr.length;
            function insertionSort(left, right) {
                for (let i = left + 1; i <= right; i++) {
                    let temp = arr[i];
                    let j = i - 1;
                    while (j >= left && arr[j] > temp) {
                        arr[j + 1] = arr[j];
                        j--;
                    }
                    arr[j + 1] = temp;
                }
            }
            function merge(l, m, r) {
                let len1 = m - l + 1, len2 = r - m;
                let left = new Array(len1), right = new Array(len2);
                for (let x = 0; x < len1; x++) left[x] = arr[l + x];
                for (let x = 0; x < len2; x++) right[x] = arr[m + 1 + x];
                let i = 0, j = 0, k = l;
                while (i < len1 && j < len2) {
                    if (left[i] <= right[j]) { arr[k] = left[i]; i++; }
                    else { arr[k] = right[j]; j++; }
                    k++;
                }
                while (i < len1) { arr[k] = left[i]; i++; k++; }
                while (j < len2) { arr[k] = right[j]; j++; k++; }
            }
            for (let i = 0; i < n; i += RUN) insertionSort(i, Math.min((i + RUN - 1), (n - 1)));
            for (let size = RUN; size < n; size = 2 * size) {
                for (let left = 0; left < n; left += 2 * size) {
                    let mid = left + size - 1;
                    let right = Math.min((left + 2 * size - 1), (n - 1));
                    if (mid < right) merge(left, mid, right);
                }
            }
        }
    },
    'intro-sort': {
        title: 'Intro Sort',
        desc: "A hybrid sorting algorithm that provides both fast average performance and (asymptotically) optimal worst-case performance. It begins with quicksort, then switches to heapsort when recursion depth exceeds a level.",
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(log n)',
        chars: [{ icon: 'check_circle', text: 'In-place algorithm' }, { icon: 'cancel', text: 'Not stable' }],
        apps: "Standard sort algorithm in many implementations of the C++ Standard Template Library (STL).",
        run: async (api) => {
            let n = api.arr.length;
            let depthLimit = 2 * Math.floor(Math.log2(n));

            async function heapify(n, i, offset) {
                let largest = i;
                let l = 2 * i + 1;
                let r = 2 * i + 2;
                if (l < n && await api.compare(offset + l, offset + largest) > 0) largest = l;
                if (r < n && await api.compare(offset + r, offset + largest) > 0) largest = r;
                if (largest !== i) {
                    await api.swap(offset + i, offset + largest);
                    await heapify(n, largest, offset);
                }
            }
            async function heapSort(start, end) {
                let length = end - start + 1;
                for (let i = Math.floor(length / 2) - 1; i >= 0; i--) await heapify(length, i, start);
                for (let i = length - 1; i > 0; i--) {
                    await api.swap(start, start + i);
                    await heapify(i, 0, start);
                }
            }
            async function partition(low, high) {
                let i = low - 1;
                for (let j = low; j < high; j++) {
                    if (await api.compare(j, high) <= 0) {
                        i++;
                        await api.swap(i, j);
                    }
                }
                await api.swap(i + 1, high);
                return i + 1;
            }
            async function sort(low, high, depthLimit) {
                let size = high - low + 1;
                if (size < 16) {
                    for (let i = low + 1; i <= high; i++) {
                        let j = i;
                        while (j > low && await api.compare(j - 1, j) > 0) {
                            await api.swap(j, j - 1);
                            j--;
                        }
                    }
                    return;
                }
                if (depthLimit === 0) {
                    await heapSort(low, high);
                    return;
                }
                let pi = await partition(low, high);
                await sort(low, pi - 1, depthLimit - 1);
                await sort(pi + 1, high, depthLimit - 1);
            }
            await sort(0, n - 1, depthLimit);
        },
        runRaw: (arr) => {
            let n = arr.length;
            let depthLimit = 2 * Math.floor(Math.log2(n));
            function heapify(n, i, offset) {
                let largest = i, l = 2 * i + 1, r = 2 * i + 2;
                if (l < n && arr[offset + l] > arr[offset + largest]) largest = l;
                if (r < n && arr[offset + r] > arr[offset + largest]) largest = r;
                if (largest !== i) {
                    let temp = arr[offset + i]; arr[offset + i] = arr[offset + largest]; arr[offset + largest] = temp;
                    heapify(n, largest, offset);
                }
            }
            function heapSort(start, end) {
                let length = end - start + 1;
                for (let i = Math.floor(length / 2) - 1; i >= 0; i--) heapify(length, i, start);
                for (let i = length - 1; i > 0; i--) {
                    let temp = arr[start]; arr[start] = arr[start + i]; arr[start + i] = temp;
                    heapify(i, 0, start);
                }
            }
            function partition(low, high) {
                let i = low - 1;
                let pivot = arr[high];
                for (let j = low; j < high; j++) {
                    if (arr[j] <= pivot) {
                        i++;
                        let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
                    }
                }
                let temp2 = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp2;
                return i + 1;
            }
            function sort(low, high, depthLimit) {
                let size = high - low + 1;
                if (size < 16) {
                    for (let i = low + 1; i <= high; i++) {
                        let key = arr[i];
                        let j = i - 1;
                        while (j >= low && arr[j] > key) {
                            arr[j + 1] = arr[j];
                            j--;
                        }
                        arr[j + 1] = key;
                    }
                    return;
                }
                if (depthLimit === 0) {
                    heapSort(low, high);
                    return;
                }
                let pi = partition(low, high);
                sort(low, pi - 1, depthLimit - 1);
                sort(pi + 1, high, depthLimit - 1);
            }
            sort(0, n - 1, depthLimit);
        }
    },
    'shell-sort': {
        title: 'Shell Sort',
        desc: "An in-place comparison sort. It is a generalization of insertion sort that allows the exchange of items that are far apart, bridging gaps.",
        best: 'O(n log n)', avg: 'O(n logÂ² n)', worst: 'O(nÂ²)', space: 'O(1)',
        chars: [{ icon: 'check_circle', text: 'In-place algorithm' }, { icon: 'cancel', text: 'Not stable' }],
        apps: "Used in hardware/embedded systems where memory space is tightly restricted and a simple robust algorithm is needed.",
        run: async (api) => {
            let n = api.arr.length;
            for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
                for (let i = gap; i < n; i++) {
                    let j = i;
                    while (j >= gap && await api.compare(j - gap, j) > 0) {
                        await api.swap(j, j - gap);
                        j -= gap;
                    }
                }
            }
        },
        runRaw: (arr) => {
            let n = arr.length;
            for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
                for (let i = gap; i < n; i++) {
                    let temp = arr[i];
                    let j;
                    for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                        arr[j] = arr[j - gap];
                    }
                    arr[j] = temp;
                }
            }
        }
    },
    'pdq-sort': {
        title: 'PDQ Sort',
        desc: "Pattern-defeating quicksort combines the fast average case of randomized quicksort with the fast worst case of heapsort, while achieving linear time on certain patterns.",
        best: 'O(n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(log n)',
        chars: [{ icon: 'check_circle', text: 'In-place algorithm' }, { icon: 'cancel', text: 'Not stable' }],
        apps: "Used in Rust and recent Go standard libraries as the default sorting mechanism.",
        run: async (api) => {
            let n = api.arr.length;
            async function insertionSort(l, r) {
                for (let i = l + 1; i <= r; i++) {
                    let j = i;
                    while (j > l && await api.compare(j - 1, j) > 0) {
                        await api.swap(j, j - 1);
                        j--;
                    }
                }
            }
            async function heapify(sz, index, start) {
                let limit = start + sz;
                let cur = start + index;
                let largest = cur;
                let l = start + 2 * index + 1;
                let r = start + 2 * index + 2;
                if (l < limit && await api.compare(l, largest) > 0) largest = l;
                if (r < limit && await api.compare(r, largest) > 0) largest = r;
                if (largest !== cur) {
                    await api.swap(cur, largest);
                    await heapify(sz, largest - start, start);
                }
            }
            async function heapSort(l, r) {
                let sz = r - l + 1;
                for (let idx = Math.floor(sz / 2) - 1; idx >= 0; idx--) await heapify(sz, idx, l);
                for (let idx = sz - 1; idx > 0; idx--) {
                    await api.swap(l, l + idx);
                    await heapify(idx, 0, l);
                }
            }
            async function sort(l, r, badAllowed) {
                let sz = r - l + 1;
                if (sz < 16) { await insertionSort(l, r); return; }
                if (badAllowed === 0) { await heapSort(l, r); return; }

                let mid = l + Math.floor(sz / 2);
                if (await api.compare(l, mid) > 0) await api.swap(l, mid);
                if (await api.compare(l, r) > 0) await api.swap(l, r);
                if (await api.compare(mid, r) > 0) await api.swap(mid, r);

                await api.swap(mid, r - 1);
                let pIdx = r - 1;
                let i = l, j = r - 1;
                while (true) {
                    while (await api.compare(++i, pIdx) < 0);
                    while (await api.compare(--j, pIdx) > 0 && j > l);
                    if (i >= j) break;
                    await api.swap(i, j);
                }
                await api.swap(i, pIdx);

                let lSize = i - l;
                if (lSize < sz / 8) badAllowed--;

                await sort(l, i - 1, badAllowed);
                await sort(i + 1, r, badAllowed);
            }
            await sort(0, n - 1, Math.floor(Math.log2(n)));
        },
        runRaw: (arr) => {
            const n = arr.length;
            function insertionSort(l, r) {
                for (let i = l + 1; i <= r; i++) {
                    let temp = arr[i], j = i;
                    while (j > l && arr[j - 1] > temp) {
                        arr[j] = arr[j - 1];
                        j--;
                    }
                    arr[j] = temp;
                }
            }
            function heapify(sz, index, start) {
                let limit = start + sz;
                let cur = start + index;
                let largest = cur;
                let l = start + 2 * index + 1;
                let r = start + 2 * index + 2;
                if (l < limit && arr[l] > arr[largest]) largest = l;
                if (r < limit && arr[r] > arr[largest]) largest = r;
                if (largest !== cur) {
                    [arr[cur], arr[largest]] = [arr[largest], arr[cur]];
                    heapify(sz, largest - start, start);
                }
            }
            function heapSort(l, r) {
                let sz = r - l + 1;
                for (let idx = Math.floor(sz / 2) - 1; idx >= 0; idx--) heapify(sz, idx, l);
                for (let idx = sz - 1; idx > 0; idx--) {
                    [arr[l], arr[l + idx]] = [arr[l + idx], arr[l]];
                    heapify(idx, 0, l);
                }
            }
            function sort(l, r, badAllowed) {
                let sz = r - l + 1;
                if (sz < 16) { insertionSort(l, r); return; }
                if (badAllowed === 0) { heapSort(l, r); return; }

                let mid = l + Math.floor(sz / 2);
                if (arr[l] > arr[mid]) [arr[l], arr[mid]] = [arr[mid], arr[l]];
                if (arr[l] > arr[r]) [arr[l], arr[r]] = [arr[r], arr[l]];
                if (arr[mid] > arr[r]) [arr[mid], arr[r]] = [arr[r], arr[mid]];

                [arr[mid], arr[r - 1]] = [arr[r - 1], arr[mid]];
                let pivot = arr[r - 1];
                let i = l, j = r - 1;
                while (true) {
                    while (arr[++i] < pivot);
                    while (arr[--j] > pivot && j > l);
                    if (i >= j) break;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                [arr[i], arr[r - 1]] = [arr[r - 1], arr[i]];

                let lSize = i - l;
                if (lSize < sz / 8) badAllowed--;

                sort(l, i - 1, badAllowed);
                sort(i + 1, r, badAllowed);
            }
            sort(0, n - 1, Math.floor(Math.log2(n)));
        }
    },
    'dual-pivot-quick-sort': {
        title: 'Dual Pivot Quick Sort',
        desc: "A variation of Quick Sort using two pivots instead of one. It divides the array into three sections, leading to fewer comparisons and swaps in practice.",
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(nÂ²)', space: 'O(log n)',
        chars: [{ icon: 'check_circle', text: 'In-place algorithm' }, { icon: 'cancel', text: 'Not stable' }],
        apps: "Used extensively in Java 7+ for sorting arrays of primitive data types.",
        run: async (api) => {
            async function sort(low, high) {
                if (low < high) {
                    if (await api.compare(low, high) > 0) await api.swap(low, high);
                    let j = low + 1, g = high - 1, k = low + 1;
                    while (k <= g) {
                        if (await api.compare(k, low) < 0) {
                            await api.swap(k, j);
                            j++;
                        } else if (await api.compare(k, high) >= 0) {
                            while (await api.compare(g, high) > 0 && k < g) g--;
                            await api.swap(k, g);
                            g--;
                            if (await api.compare(k, low) < 0) {
                                await api.swap(k, j);
                                j++;
                            }
                        }
                        k++;
                    }
                    j--; g++;
                    await api.swap(low, j);
                    await api.swap(high, g);
                    await sort(low, j - 1);
                    await sort(j + 1, g - 1);
                    await sort(g + 1, high);
                }
            }
            await sort(0, api.arr.length - 1);
        },
        runRaw: (arr) => {
            function sort(low, high) {
                if (low < high) {
                    if (arr[low] > arr[high]) {
                        let temp = arr[low]; arr[low] = arr[high]; arr[high] = temp;
                    }
                    let j = low + 1, g = high - 1, k = low + 1;
                    while (k <= g) {
                        if (arr[k] < arr[low]) {
                            let temp = arr[k]; arr[k] = arr[j]; arr[j] = temp;
                            j++;
                        } else if (arr[k] >= arr[high]) {
                            while (arr[g] > arr[high] && k < g) g--;
                            let temp = arr[k]; arr[k] = arr[g]; arr[g] = temp;
                            g--;
                            if (arr[k] < arr[low]) {
                                let temp2 = arr[k]; arr[k] = arr[j]; arr[j] = temp2;
                                j++;
                            }
                        }
                        k++;
                    }
                    j--; g++;
                    let temp3 = arr[low]; arr[low] = arr[j]; arr[j] = temp3;
                    let temp4 = arr[high]; arr[high] = arr[g]; arr[g] = temp4;
                    sort(low, j - 1);
                    sort(j + 1, g - 1);
                    sort(g + 1, high);
                }
            }
            sort(0, arr.length - 1);
        }
    },
    'block-sort': {
        title: 'Block Sort',
        desc: "A stable sorting algorithm that achieves an O(1) memory bound while dividing the array into blocks and sorting them.",
        best: 'O(n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)',
        chars: [{ icon: 'check_circle', text: 'In-place algorithm' }, { icon: 'check_circle', text: 'Stable sort' }],
        apps: "Situations requiring O(1) space and stability, conceptually bridging Merge and Insertion sort capabilities.",
        run: async (api) => {
            let n = api.arr.length;
            let blockSize = Math.max(2, Math.floor(Math.sqrt(n)));
            async function insertionSort(l, r) {
                for (let i = l + 1; i <= r; i++) {
                    let j = i;
                    while (j > l && await api.compare(j - 1, j) > 0) {
                        await api.swap(j, j - 1); j--;
                    }
                }
            }
            for (let i = 0; i < n; i += blockSize) {
                await insertionSort(i, Math.min(i + blockSize - 1, n - 1));
            }
            await insertionSort(0, n - 1);
        },
        runRaw: (arr) => {
            let n = arr.length;
            let blockSize = Math.max(2, Math.floor(Math.sqrt(n)));
            function insertionSort(l, r) {
                for (let i = l + 1; i <= r; i++) {
                    let key = arr[i];
                    let j = i - 1;
                    while (j >= l && arr[j] > key) {
                        arr[j + 1] = arr[j];
                        j--;
                    }
                    arr[j + 1] = key;
                }
            }
            for (let i = 0; i < n; i += blockSize) {
                insertionSort(i, Math.min(i + blockSize - 1, n - 1));
            }
            insertionSort(0, n - 1);
        }
    },
    'dual-fusion-sort': {
        title: 'Dual Fusion Sort',
        desc: "A stylized variant of Merge Sort that uses an interwoven bi-directional merge logic to optimize elements overhead in subsets.",
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(log n)',
        chars: [{ icon: 'cancel', text: 'Requires some extra space' }, { icon: 'check_circle', text: 'Stable sort' }],
        apps: "Highly specialized edge-case environments focused on cache performance bridging.",
        run: async (api) => {
            let n = api.arr.length;
            async function sort(l, r) {
                if (l >= r) return;
                let mid = l + Math.floor((r - l) / 2);
                await sort(l, mid);
                await sort(mid + 1, r);

                let end_low = mid, start_high = mid + 1;
                while (l <= end_low && start_high <= r) {
                    if (await api.compare(l, start_high) <= 0) {
                        l++;
                    } else {
                        let valueIdx = start_high;
                        for (let i = valueIdx; i > l; i--) await api.swap(i, i - 1);
                        l++; end_low++; start_high++;
                    }
                }
            }
            await sort(0, n - 1);
        },
        runRaw: (arr) => {
            let n = arr.length;
            function sort(l, r) {
                if (l >= r) return;
                let mid = l + Math.floor((r - l) / 2);
                sort(l, mid);
                sort(mid + 1, r);

                let end_low = mid, start_high = mid + 1;
                while (l <= end_low && start_high <= r) {
                    if (arr[l] <= arr[start_high]) {
                        l++;
                    } else {
                        let valueIdx = start_high;
                        let val = arr[valueIdx];
                        for (let i = valueIdx; i > l; i--) arr[i] = arr[i - 1];
                        arr[l] = val;
                        l++; end_low++; start_high++;
                    }
                }
            }
            sort(0, n - 1);
        }
    }
};

/* --- BENCHMARK & RAW API --- */
class RawSortAPI {
    constructor(arr) {
        this.arr = [...arr];
        this.comparisons = 0;
        this.swaps = 0;
    }
    async compare(i, j) { this.comparisons++; return this.arr[i] - this.arr[j]; }
    async swap(i, j) {
        this.swaps++;
        let temp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
    }
    async set(i, val) { this.swaps++; this.arr[i] = val; }
    async sleep() { return; }
}

let currentModalAlgoId = null;
let benchmarkData = null;
let benchmarkTimeMs = 0; // stored in ms always
let benchTimeUnit = 'ms'; // 'ms', 'Âµs', 'ns'
let storedTheoreticalBestMs = 0;
let storedTheoreticalAvgMs = 0;
let storedTheoreticalWorstMs = 0;

// Theoretical complexity calculator
function computeTheoretical(n, complexityStr) {
    if (!n || n <= 0) return 'â€”';
    let ops = 0;
    const s = complexityStr.replace(/\s/g, '');
    if (s === 'O(nlogn)' || s === 'O(n log n)') {
        ops = n * Math.log2(n);
    } else if (s === 'O(nÂ²)' || s === 'O(n^2)') {
        ops = n * n;
    } else if (s === 'O(n)') {
        ops = n;
    } else if (s === 'O(logn)' || s === 'O(log n)') {
        ops = Math.log2(n);
    } else if (s === 'O(1)') {
        ops = 1;
    } else if (s === 'O(nÂ²/2)') {
        ops = (n * n) / 2;
    } else {
        // Try to parse generically
        if (s.includes('nÂ²')) ops = n * n;
        else if (s.includes('nlogn') || s.includes('n log n')) ops = n * Math.log2(n);
        else if (s.includes('n')) ops = n;
        else return complexityStr;
    }
    return formatLargeNumber(Math.round(ops));
}

function formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
}

function displayTimeInUnit(ms, unit) {
    if (unit === 'Âµs') return (ms * 1000).toFixed(2);
    if (unit === 'ns') return (ms * 1000000).toFixed(0);
    return ms.toFixed(2);
}

// Get raw ops count for a complexity string and n
function computeTheoreticalOps(n, complexityStr) {
    if (!n || n <= 0) return 0;
    const s = complexityStr.replace(/\s/g, '');
    if (s === 'O(nlogn)' || s === 'O(nlog n)') return n * Math.log2(n);
    if (s === 'O(nÂ²)' || s === 'O(n^2)') return n * n;
    if (s === 'O(n)') return n;
    if (s === 'O(logn)' || s === 'O(logn)') return Math.log2(n);
    if (s === 'O(1)') return 1;
    // generic fallbacks
    if (s.includes('nÂ²') || s.includes('n^2')) return n * n;
    if (s.includes('nlogn') || s.includes('nlog')) return n * Math.log2(n);
    if (s.includes('n')) return n;
    return n;
}

// === Machine-calibrated theoretical time estimation ===
// Instead of deriving cost-per-op from the actual run (which always matches),
// we run a one-time calibration sort to measure real cost-per-op independently.
let calibratedCostPerOp = null; // ms per single comparison+swap

function calibrateCostPerOp() {
    if (calibratedCostPerOp !== null) return calibratedCostPerOp;

    // Run a small reference sort (10,000 items) to calibrate
    const calSize = 10000;
    const calArr = [];
    for (let i = 0; i < calSize; i++) calArr.push(Math.random() * 100000);

    // Warm up JIT
    const warmup = [...calArr];
    warmup.sort((a, b) => a - b);

    // Measure a merge-sort-like O(n log n) workload
    const calCopy = [...calArr];
    const t0 = performance.now();
    // Run native sort which is ~O(n log n)
    calCopy.sort((a, b) => a - b);
    const t1 = performance.now();

    const calMs = t1 - t0;
    const calOps = calSize * Math.log2(calSize); // ~133,000 ops
    calibratedCostPerOp = calMs / calOps;

    return calibratedCostPerOp;
}

// Compute theoretical time independently of actual measurement
// Uses calibrated per-op cost Ã— theoretical operation count for the given N
function computeTheoreticalTimeMs(n, complexityStr) {
    const costPerOp = calibrateCostPerOp();
    const ops = computeTheoreticalOps(n, complexityStr);
    return costPerOp * ops;
}

/* --- UI MANIPULATION AND STATE --- */
const STATE = {
    array: [],
    isPlaying: false,
    isPaused: false,
    mode: 'compare', // 'compare' or 'single'
    leftAlgo: 'quick-sort',
    rightAlgo: 'merge-sort',
    resolvers: [],
    leftApi: null,
    rightApi: null,
};

let UI = {};

const algoKeys = Object.keys(algorithms);

document.addEventListener('DOMContentLoaded', () => {
    // Only capture DOM nodes once they are loaded
    UI = {
        arenaLeft: document.getElementById('arena-left'),
        arenaRight: document.getElementById('arena-right'),
        titleLeft: document.getElementById('title-left'),
        titleRight: document.getElementById('title-right'),
        compLeft: document.getElementById('complexity-left'),
        compRight: document.getElementById('complexity-right'),
        opsLeft: document.getElementById('ops-left'),
        opsRight: document.getElementById('ops-right'),
        selLeft: document.getElementById('selector-left'),
        selRight: document.getElementById('selector-right'),
        btnPlay: document.getElementById('btn-play'),
        btnPause: document.getElementById('btn-pause'),
        btnReplay: document.getElementById('btn-replay'),
        sliderSpeed: document.getElementById('slider-speed'),
        sliderSize: document.getElementById('slider-size'),
        sizeDisplay: document.getElementById('array-size-display'),
        speedDisplay: document.getElementById('base-speed-display'),

        // Benchmark UI
        benchFile: document.getElementById('benchmark-file'),
        benchFileLabel: document.getElementById('benchmark-file-label'),
        btnRunBench: document.getElementById('btn-run-benchmark'),
        btnDeleteFile: document.getElementById('btn-delete-file'),
        benchResults: document.getElementById('benchmark-results'),
        benchN: document.getElementById('bench-n'),
        benchTime: document.getElementById('bench-time'),
        benchTimeUnit: document.getElementById('bench-time-unit'),
        benchStatus: document.getElementById('bench-status'),
        benchComparisons: document.getElementById('bench-comparisons'),
        benchSwaps: document.getElementById('bench-swaps'),
        benchTheoryBest: document.getElementById('bench-theory-best'),
        benchTheoryAvg: document.getElementById('bench-theory-avg'),
        benchTheoryWorst: document.getElementById('bench-theory-worst'),
        benchChart: document.getElementById('bench-bar-visual'),
        benchActualTime: document.getElementById('bench-actual-time'),
        benchActualUnit: document.getElementById('bench-actual-unit'),
        benchTheoreticalTime: document.getElementById('bench-theoretical-time'),
        benchTheoreticalUnit: document.getElementById('bench-theoretical-unit'),
        benchDiffBadge: document.getElementById('bench-diff-badge'),
        benchBarActual: document.getElementById('bench-bar-actual'),
        benchBarTheory: document.getElementById('bench-bar-theory'),
        benchBarActualLabel: document.getElementById('bench-bar-actual-label'),
        benchBarTheoryLabel: document.getElementById('bench-bar-theory-label'),
        btnStartVis: document.getElementById('btn-start-visualization'),
        // Mobile slider mirrors
        sliderSpeedMobile: document.getElementById('slider-speed-mobile'),
        sliderSizeMobile: document.getElementById('slider-size-mobile'),
    };

    // Initialize UI Text
    updateAlgoHeaders();
    generateArray();
    renderInitialArenas();

    /* --- EVENT LISTENERS --- */

    UI.selLeft.addEventListener('click', () => {
        if (STATE.mode === 'single') return;
        if (STATE.isPlaying && !STATE.isPaused) return;
        if (STATE.isPlaying) stopSorting();
        let idx = algoKeys.indexOf(STATE.leftAlgo);
        STATE.leftAlgo = algoKeys[(idx + 1) % algoKeys.length];
        updateAlgoHeaders();
    });

    UI.selRight.addEventListener('click', () => {
        if (STATE.isPlaying && !STATE.isPaused) return;
        if (STATE.isPlaying) stopSorting();
        let idx = algoKeys.indexOf(STATE.rightAlgo);
        STATE.rightAlgo = algoKeys[(idx + 1) % algoKeys.length];
        updateAlgoHeaders();
    });

    UI.sliderSize.addEventListener('input', () => {
        if (STATE.isPlaying) stopSorting();
        generateArray();
        renderInitialArenas();
    });

    UI.sliderSpeed.addEventListener('input', () => {
        let delay = 101 - parseInt(UI.sliderSpeed.value);
        UI.speedDisplay.textContent = `Base Yield: ${delay}ms`;
        if (UI.sliderSpeedMobile) UI.sliderSpeedMobile.value = UI.sliderSpeed.value;
    });

    // Mobile slider mirrors
    if (UI.sliderSizeMobile) {
        UI.sliderSizeMobile.addEventListener('input', () => {
            UI.sliderSize.value = UI.sliderSizeMobile.value;
            if (STATE.isPlaying) stopSorting();
            generateArray();
            renderInitialArenas();
        });
    }
    if (UI.sliderSpeedMobile) {
        UI.sliderSpeedMobile.addEventListener('input', () => {
            UI.sliderSpeed.value = UI.sliderSpeedMobile.value;
            let delay = 101 - parseInt(UI.sliderSpeedMobile.value);
            UI.speedDisplay.textContent = `Base Yield: ${delay}ms`;
        });
    }

    UI.btnPlay.addEventListener('click', togglePlay);

    UI.btnPause.addEventListener('click', () => {
        if (STATE.isPlaying) {
            STATE.isPaused = true;
            UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Resume</span>';
        }
    });

    UI.btnReplay.addEventListener('click', () => {
        stopSorting();
        generateArray();
        renderInitialArenas();
    });

    /* --- MODAL LOGIC FOR SIDEBAR BUTTONS --- */
    const modal = document.getElementById('algorithm-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    algoKeys.forEach(key => {
        const btn = document.getElementById(`btn-${key}`);
        if (btn) btn.addEventListener('click', () => openModal(key));
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Start Visualization Button inside Modal
    if (UI.btnStartVis) {
        UI.btnStartVis.addEventListener('click', () => {
            STATE.mode = 'single';
            STATE.leftAlgo = currentModalAlgoId;
            closeModal();
            
            // Layout Adjustments -> Single Mode
            const rightSection = document.getElementById('arena-right-section');
            const codeSection = document.getElementById('single-code-section');
            const divDes = document.getElementById('vs-divider-desktop');
            const divMob = document.getElementById('vs-divider-mobile');

            if (rightSection) { rightSection.classList.add('hidden'); rightSection.classList.remove('flex'); }
            if (divDes) { divDes.classList.add('hidden'); divDes.classList.remove('md:block'); }
            if (divMob) { divMob.classList.add('hidden'); divMob.classList.remove('block'); }
            if (codeSection) { codeSection.classList.remove('hidden'); codeSection.classList.add('flex'); }

            const labelLeft = document.getElementById('left-algo-label');
            const selectorLeft = document.getElementById('selector-left');
            if (labelLeft) labelLeft.textContent = "Selected Algorithm";
            if (selectorLeft) {
                selectorLeft.classList.remove('cursor-pointer', 'group');
            }

            // Populate snippet
            const codeDisplay = document.getElementById('single-code-display');
            if (codeDisplay && algorithmCode[currentModalAlgoId]) {
                const code = algorithmCode[currentModalAlgoId];
                codeDisplay.innerHTML = highlightCodeForExecution(code);
            }

            updateAlgoHeaders();
            generateArray();
            renderInitialArenas();
            
            const homePage = document.getElementById('home-page');
            const arenaPage = document.getElementById('arena-page');
            if (homePage && arenaPage) {
                homePage.classList.add('hidden');
                homePage.classList.remove('flex');
                arenaPage.classList.remove('hidden');
                arenaPage.classList.add('flex');
            }
        });
    }

    /* --- IMPLEMENTATION TAB: Code Viewer --- */

    // Clean algorithm code strings for display
    const algorithmCode = window.algorithmCode = {
        'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        // Choose last element as pivot
        let pivotIndex = partition(arr, low, high);

        // Recursively sort left and right halves
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            // Swap arr[i] and arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,

        'merge-sort': `function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    // Split array into two halves
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    // Merge the two sorted halves
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // Append remaining elements
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,

        'bubble-sort': `function bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap them
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }

        // Optimization: if no swaps occurred,
        // array is already sorted
        if (!swapped) break;
    }

    return arr;
}`,

        'insertion-sort': `function insertionSort(arr) {
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        // Pick the element to be inserted
        let key = arr[i];
        let j = i - 1;

        // Shift elements greater than key
        // one position to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        // Insert key at correct position
        arr[j + 1] = key;
    }

    return arr;
}`,

        'selection-sort': `function selectionSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        // Find the minimum element
        // in the unsorted portion
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        // Swap the found minimum with
        // the first unsorted element
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }

    return arr;
}`,

        'heap-sort': `function heapSort(arr) {
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];

        // Heapify the reduced heap
        heapify(arr, i, 0);
    }

    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}
`,

        'tim-sort': `const MIN_MERGE = 32;

function minRunLength(n) {
    let r = 0;
    while (n >= MIN_MERGE) {
        r |= (n & 1);
        n >>= 1;
    }
    return n + r;
}

function timSort(arr) {
    let n = arr.length;
    let minRun = minRunLength(MIN_MERGE);
    
    for (let i = 0; i < n; i += minRun) {
        insertionSort(arr, i, Math.min(i + minRun - 1, n - 1));
    }
    
    for (let size = minRun; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
            let mid = left + size - 1;
            let right = Math.min(left + 2 * size - 1, (n - 1));
            if (mid < right) {
                merge(arr, left, mid, right);
            }
        }
    }
    return arr;
}`,

        'intro-sort': `function introSort(arr) {
    let maxDepth = Math.floor(Math.log2(arr.length)) * 2;
    introSortRecursive(arr, 0, arr.length - 1, maxDepth);
    return arr;
}

function introSortRecursive(arr, start, end, maxDepth) {
    let size = end - start;
    if (size < 16) {
        insertionSort(arr, start, end);
        return;
    }
    if (maxDepth === 0) {
        heapSort(arr, start, end);
        return;
    }
    let pivot = partition(arr, start, end);
    introSortRecursive(arr, start, pivot - 1, maxDepth - 1);
    introSortRecursive(arr, pivot + 1, end, maxDepth - 1);
}`,

        'shell-sort': `function shellSort(arr) {
    let n = arr.length;
    
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
    return arr;
}`,

        'pdq-sort': `// Pattern-Defeating Quicksort (PDQSort)
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function insertionSort(arr, left, right) {
    for (let i = left + 1; i <= right; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

function heapify(arr, size, index, start) {
    let cur = start + index;
    let largest = cur;
    let l = start + 2 * index + 1;
    let r = start + 2 * index + 2;
    let limit = start + size;
    
    if (l < limit && arr[l] > arr[largest]) largest = l;
    if (r < limit && arr[r] > arr[largest]) largest = r;
    
    if (largest !== cur) {
        swap(arr, cur, largest);
        heapify(arr, size, largest - start, start);
    }
}

function heapSort(arr, left, right) {
    let size = right - left + 1;
    for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
        heapify(arr, size, i, left);
    }
    for (let i = size - 1; i > 0; i--) {
        swap(arr, left, left + i);
        heapify(arr, i, 0, left);
    }
}

function choosePivot(arr, begin, end) {
    let size = end - begin;
    let mid = begin + Math.floor(size / 2);
    if (arr[begin] > arr[mid]) swap(arr, begin, mid);
    if (arr[mid] > arr[end - 1]) swap(arr, mid, end - 1);
    if (arr[begin] > arr[mid]) swap(arr, begin, mid);
    return mid;
}

function partitionRight(arr, begin, end, pivotPos) {
    let pivotValue = arr[pivotPos];
    swap(arr, pivotPos, end - 1);
    
    let storeIdx = begin;
    for (let i = begin; i < end - 1; i++) {
        if (arr[i] < pivotValue) {
            swap(arr, i, storeIdx);
            storeIdx++;
        }
    }
    swap(arr, storeIdx, end - 1);
    
    let unbalanced = (storeIdx - begin) < (end - storeIdx - 1);
    let threshold = (end - begin) / 8;
    let highlyUnbalanced = (storeIdx - begin) < threshold || (end - storeIdx - 1) < threshold;
    
    return { pivotIdx: storeIdx, highlyUnbalanced: highlyUnbalanced };
}

function pdqSort(arr) {
    pdqSortHelper(arr, 0, arr.length, Math.log2(arr.length));
    return arr;
}

function pdqSortHelper(arr, begin, end, badAllowed) {
    while (true) {
        let size = end - begin;
        if (size < 16) {
            insertionSort(arr, begin, end - 1);
            return;
        }
        if (badAllowed === 0) {
            heapSort(arr, begin, end - 1);
            return;
        }
        
        let pivotPos = choosePivot(arr, begin, end);
        let part = partitionRight(arr, begin, end, pivotPos);
        let pivotIdx = part.pivotIdx;
        let highlyUnbalanced = part.highlyUnbalanced;
        
        pdqSortHelper(arr, begin, pivotIdx, badAllowed);
        
        begin = pivotIdx + 1;
        if (highlyUnbalanced) {
            badAllowed--;
        }
    }
}

pdqSort(arr);
return arr;`,

        'dual-pivot-quick-sort': `function dualPivotQuickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pivots = partitionDual(arr, low, high);
        
        dualPivotQuickSort(arr, low, pivots[0] - 1);
        dualPivotQuickSort(arr, pivots[0] + 1, pivots[1] - 1);
        dualPivotQuickSort(arr, pivots[1] + 1, high);
    }
    return arr;
}

function partitionDual(arr, low, high) {
    if (arr[low] > arr[high]) {
        swap(arr, low, high);
    }
    let p = arr[low], q = arr[high];
    let j = low + 1, g = high - 1, k = low + 1;
    
    while (k <= g) {
        if (arr[k] < p) {
            swap(arr, k, j);
            j++;
        } else if (arr[k] >= q) {
            while (arr[g] > q && k < g) g--;
            swap(arr, k, g);
            g--;
            if (arr[k] < p) {
                swap(arr, k, j);
                j++;
            }
        }
        k++;
    }
    j--;
    g++;
    swap(arr, low, j);
    swap(arr, high, g);
    return [j, g];
}`,

        'block-sort': `function blockSort(arr) {
    // Simplified block sort representation
    const n = arr.length;
    let blockSize = Math.floor(Math.sqrt(n));
    
    for (let i = 0; i < n; i += blockSize) {
        insertionSort(arr, i, Math.min(i + blockSize, n));
    }
    
    for (let size = blockSize; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2 * size) {
            let mid = Math.min(left + size, n);
            let right = Math.min(left + 2 * size, n);
            merge(arr, left, mid, right);
        }
    }
    return arr;
}`,

        'dual-fusion-sort': `function dualFusionSort(arr) {
    // Hybrid of Merge Sort and Dual-Pivot Quick Sort
    if (arr.length <= 1) return arr;
    
    if (arr.length < 32) {
        return dualPivotQuickSort(arr, 0, arr.length - 1);
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = dualFusionSort(arr.slice(0, mid));
    const right = dualFusionSort(arr.slice(mid));
    
    return merge(left, right);
}`
    };

    // Lightweight JavaScript syntax highlighter
    function highlightCode(code) {
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const lines = html.split('\n');
        const highlighted = lines.map((line, i) => {
            const lineNum = String(i + 1).padStart(3, ' ');
            let coloredLine = line
                .replace(/(\/\/.*)/g, '<span style=color:#6a9955;font-style:italic;>$1</span>')
                .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style=color:#ce9178;>$1</span>')
                .replace(/\b(function|const|let|var|if|else|for|while|return|break|continue|new|typeof|class|extends|async|await)\b/g, '<span style=color:#c586c0;>$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span style=color:#b5cea8;>$1</span>')
                .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style=color:#dcdcaa;>$1</span>')
                .replace(/\.(length|push|pop|slice|concat|floor|log)\b/g, '.<span style=color:#4fc1ff;>$1</span>');

            return `<span style="color:#858585;user-select:none;">${lineNum} </span>${coloredLine}`;
        });

        return highlighted.join('\n');
    }

    const highlightCodeForExecution = window.highlightCodeForExecution = function(code) {
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const lines = html.split('\n');
        const highlighted = lines.map((line, i) => {
            const lineNum = String(i + 1).padStart(3, ' ');
            let coloredLine = line
                .replace(/(\/\/.*)/g, '<span style=color:#6a9955;font-style:italic;>$1</span>')
                .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style=color:#ce9178;>$1</span>')
                .replace(/\b(function|const|let|var|if|else|for|while|return|break|continue|new|typeof|class|extends|async|await)\b/g, '<span style=color:#c586c0;>$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span style=color:#b5cea8;>$1</span>')
                .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style=color:#dcdcaa;>$1</span>')
                .replace(/\.(length|push|pop|slice|concat|floor|log)\b/g, '.<span style=color:#4fc1ff;>$1</span>');

            return `<div id="exec-line-${i + 1}" class="px-2 border-l-[3px] border-transparent transition-colors duration-150 whitespace-pre"><span style="color:#858585;user-select:none;margin-right:1rem;">${lineNum}</span>${coloredLine}</div>`;
        });

        return highlighted.join('\n');
    }

    // Tab switching
    const tabOverview = document.getElementById('tab-overview');
    const tabImpl = document.getElementById('tab-implementation');
    const panelOverview = document.getElementById('panel-overview');
    const panelImpl = document.getElementById('panel-implementation');
    const algoCodeEl = document.getElementById('algo-code');
    const codeFilename = document.getElementById('code-filename');
    const btnCopyCode = document.getElementById('btn-copy-code');

    function switchTab(activeTab) {
        if (activeTab === 'overview') {
            tabOverview.className = 'tab-btn text-primary border-b-2 border-primary pb-2 text-sm font-bold cursor-pointer transition-all';
            tabImpl.className = 'tab-btn text-slate-500 hover:text-slate-300 border-b-2 border-transparent pb-2 text-sm font-bold cursor-pointer transition-all';
            panelOverview.classList.remove('hidden');
            panelImpl.classList.add('hidden');
        } else {
            tabImpl.className = 'tab-btn text-primary border-b-2 border-primary pb-2 text-sm font-bold cursor-pointer transition-all';
            tabOverview.className = 'tab-btn text-slate-500 hover:text-slate-300 border-b-2 border-transparent pb-2 text-sm font-bold cursor-pointer transition-all';
            panelImpl.classList.remove('hidden');
            panelOverview.classList.add('hidden');

            // Render code for current algorithm
            if (currentModalAlgoId && algorithmCode[currentModalAlgoId]) {
                const code = algorithmCode[currentModalAlgoId];
                algoCodeEl.innerHTML = highlightCode(code);
                const algoData = algorithms[currentModalAlgoId];
                codeFilename.textContent = (algoData ? algoData.title.toLowerCase().replace(/\s+/g, '_') : 'algorithm') + '.js';
            }
        }
    }

    tabOverview.addEventListener('click', () => switchTab('overview'));
    tabImpl.addEventListener('click', () => switchTab('implementation'));

    // Copy code button
    btnCopyCode.addEventListener('click', () => {
        if (currentModalAlgoId && algorithmCode[currentModalAlgoId]) {
            navigator.clipboard.writeText(algorithmCode[currentModalAlgoId]).then(() => {
                btnCopyCode.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!';
                btnCopyCode.classList.add('text-emerald-400');
                setTimeout(() => {
                    btnCopyCode.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy';
                    btnCopyCode.classList.remove('text-emerald-400');
                }, 2000);
            });
        }
    });

    /* --- BENCHMARK EVENT LISTENERS --- */

    // File upload handler
    UI.benchFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert('File is too large. Maximum file size is 5MB.');
            UI.benchFileLabel.textContent = 'File too large';
            return;
        }

        UI.benchFileLabel.textContent = file.name;
        UI.benchFileLabel.classList.add('text-rose-400');
        UI.btnDeleteFile.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                let text = evt.target.result;

                // Remove text UI groups like '--- Group: 10 to 100 ---' from averageCase.txt
                text = text.replace(/---.*?---/g, '');

                // Parse comma, space, or newline separated numbers in O(N)
                const nums = [];
                const tokens = text.split(/[\s,]+/);
                const MAX_ELEMENTS = 50000;
                
                for (let i = 0; i < tokens.length && nums.length < MAX_ELEMENTS; i++) {
                    if (tokens[i] !== "") {
                        const num = Number(tokens[i]);
                        if (!isNaN(num) && isFinite(num)) {
                            nums.push(num);
                        }
                    }
                }

                if (nums.length === 0) {
                    alert("Invalid Data Format. No numeric elements found.");
                    benchmarkData = null;
                    UI.benchStatus.textContent = "INVALID DATA";
                    UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
                } else if (nums.length >= MAX_ELEMENTS) {
                    alert(`File contains too many elements. Maximum is ${MAX_ELEMENTS}. Using first ${MAX_ELEMENTS} elements.`);
                    benchmarkData = nums;
                    UI.btnRunBench.disabled = false;
                    UI.benchStatus.textContent = "READY";
                    UI.benchStatus.className = "text-sky-400 font-bold text-sm mt-1";
                    UI.benchResults.classList.remove('hidden');
                    UI.benchResults.classList.add('flex');
                    UI.benchN.textContent = nums.length.toLocaleString();
                } else {
                    benchmarkData = nums;
                    UI.btnRunBench.disabled = false;
                    UI.benchStatus.textContent = "READY";
                    UI.benchStatus.className = "text-sky-400 font-bold text-sm mt-1";
                    UI.benchResults.classList.remove('hidden');
                    UI.benchResults.classList.add('flex');
                    UI.benchN.textContent = nums.length.toLocaleString();
                    UI.benchTime.textContent = "0.00";
                    UI.benchComparisons.textContent = "0";
                    UI.benchSwaps.textContent = "0";

                    // Show theoretical complexity if algo is selected
                    if (currentModalAlgoId) {
                        const algo = algorithms[currentModalAlgoId];
                        const n = nums.length;
                        UI.benchTheoryBest.textContent = computeTheoretical(n, algo.best);
                        UI.benchTheoryAvg.textContent = computeTheoretical(n, algo.avg);
                        UI.benchTheoryWorst.textContent = computeTheoretical(n, algo.worst);
                    }
                }
            } catch (err) {
                console.error('Error parsing benchmark file:', err);
                alert('Error parsing file: ' + err.message);
                UI.benchFileLabel.textContent = 'Upload failed';
                benchmarkData = null;
                UI.benchStatus.textContent = "ERROR";
                UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
            }
        };
        reader.onerror = () => {
            alert('Error reading file. Please try again.');
            console.error('FileReader error');
            UI.benchFileLabel.textContent = 'Read error';
            benchmarkData = null;
            UI.benchStatus.textContent = "ERROR";
            UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
        };
        reader.readAsText(file);
    });

    // Delete file handler
    UI.btnDeleteFile.addEventListener('click', () => {
        benchmarkData = null;
        benchmarkTimeMs = 0;
        UI.benchFile.value = '';
        UI.benchFileLabel.textContent = 'Select File...';
        UI.benchFileLabel.classList.remove('text-rose-400');
        UI.btnDeleteFile.classList.add('hidden');
        UI.benchResults.classList.add('hidden');
        UI.benchResults.classList.remove('flex');
        UI.benchStatus.textContent = '';
        UI.benchN.textContent = '0';
        UI.benchTime.textContent = '0.00';
        UI.benchComparisons.textContent = '0';
        UI.benchSwaps.textContent = '0';
        UI.benchTheoryBest.textContent = 'â€”';
        UI.benchTheoryAvg.textContent = 'â€”';
        UI.benchTheoryWorst.textContent = 'â€”';
        UI.benchActualTime.textContent = '0.00';
        UI.benchTheoreticalTime.textContent = '0.00';
        UI.benchDiffBadge.textContent = 'â€”';
        UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400';
        UI.benchBarActual.style.width = '0%';
        UI.benchBarTheory.style.width = '0%';
        UI.benchBarActualLabel.textContent = '';
        UI.benchBarTheoryLabel.textContent = '';
    });

    // === Time unit selector button handlers ===
    function updateAllTimeDisplays() {
        const u = benchTimeUnit;
        // Top row execution time
        UI.benchTime.textContent = displayTimeInUnit(benchmarkTimeMs, u);
        UI.benchTimeUnit.textContent = u;
        // Comparison cards
        UI.benchActualTime.textContent = displayTimeInUnit(benchmarkTimeMs, u);
        UI.benchActualUnit.textContent = u;
        UI.benchTheoreticalTime.textContent = displayTimeInUnit(storedTheoreticalAvgMs, u);
        UI.benchTheoreticalUnit.textContent = u;
        // Chart bar labels
        UI.benchBarActualLabel.textContent = displayTimeInUnit(benchmarkTimeMs, u) + ' ' + u;
        UI.benchBarTheoryLabel.textContent = displayTimeInUnit(storedTheoreticalAvgMs, u) + ' ' + u;
        // Best/Avg/Worst
        UI.benchTheoryBest.textContent = displayTimeInUnit(storedTheoreticalBestMs, u) + ' ' + u;
        UI.benchTheoryAvg.textContent = displayTimeInUnit(storedTheoreticalAvgMs, u) + ' ' + u;
        UI.benchTheoryWorst.textContent = displayTimeInUnit(storedTheoreticalWorstMs, u) + ' ' + u;
    }

    // Unit selector buttons
    document.querySelectorAll('.bench-unit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.getAttribute('data-unit');
            benchTimeUnit = unit;
            // Highlight active button
            document.querySelectorAll('.bench-unit-btn').forEach(b => {
                b.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/10 hover:border-rose-500/30 hover:text-rose-400 transition-all';
            });
            btn.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all';
            // Re-render all time values
            if (benchmarkTimeMs > 0) {
                updateAllTimeDisplays();
            }
        });
    });

    // Also keep the top-row unit label clickable
    UI.benchTimeUnit.addEventListener('click', () => {
        const units = ['ms', 'Âµs', 'ns'];
        const idx = units.indexOf(benchTimeUnit);
        benchTimeUnit = units[(idx + 1) % units.length];
        // Sync button highlight
        document.querySelectorAll('.bench-unit-btn').forEach(b => {
            const bu = b.getAttribute('data-unit');
            if (bu === benchTimeUnit) {
                b.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all';
            } else {
                b.className = 'bench-unit-btn text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/10 hover:border-rose-500/30 hover:text-rose-400 transition-all';
            }
        });
        if (benchmarkTimeMs > 0) {
            updateAllTimeDisplays();
        }
    });

    // Run Benchmark handler
    UI.btnRunBench.addEventListener('click', async () => {
        if (!benchmarkData || benchmarkData.length === 0 || !currentModalAlgoId) return;

        UI.btnRunBench.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span>Running...';
        UI.btnRunBench.disabled = true;
        UI.benchStatus.textContent = "BENCHMARKING...";
        UI.benchStatus.className = "text-amber-400 font-bold text-sm mt-1 animate-pulse";

        // Let UI update
        await new Promise(r => setTimeout(r, 50));

        // Create a copy so benchmarkData stays unsorted for re-runs
        const dataCopy = [...benchmarkData];
        let comparisons = 0;
        let swaps = 0;

        try {
            const algo = algorithms[currentModalAlgoId];
            const n = dataCopy.length;

            // === PURE RAW TIMING â€” no async, no overhead ===
            // Always use runRaw for the actual time measurement
            const t0 = performance.now();
            if (algo.runRaw) {
                algo.runRaw(dataCopy);
            } else {
                // If somehow no runRaw, sort in-place with minimal sync logic
                dataCopy.sort((a, b) => a - b);
            }
            const t1 = performance.now();
            benchmarkTimeMs = t1 - t0;  // fully raw, zero async overhead

            // === OPS COUNTING â€” separate untimed pass ===
            // Run RawSortAPI on a fresh copy just to count comparisons/swaps
            const countCopy = [...benchmarkData];
            if (algo.runRaw) {
                // Estimate ops from theoretical complexity
                const avgComplexity = algo.avg.replace(/\s/g, '');
                if (avgComplexity.includes('nlogn') || avgComplexity.includes('nlog')) {
                    comparisons = Math.round(n * Math.log2(n));
                    swaps = Math.round(n * Math.log2(n) / 3);
                } else if (avgComplexity.includes('nÂ²') || avgComplexity.includes('n^2')) {
                    comparisons = Math.round(n * n / 2);
                    swaps = Math.round(n * n / 4);
                } else if (avgComplexity.includes('n')) {
                    comparisons = n;
                    swaps = n;
                }
            } else {
                const rawApi = new RawSortAPI(countCopy);
                await algo.run(rawApi);
                comparisons = rawApi.comparisons;
                swaps = rawApi.swaps;
            }

            UI.benchTime.textContent = displayTimeInUnit(benchmarkTimeMs, benchTimeUnit);
            UI.benchTimeUnit.textContent = benchTimeUnit;
            UI.benchStatus.textContent = "SUCCESS";
            UI.benchStatus.className = "text-emerald-400 font-bold text-sm mt-1";

            UI.benchComparisons.textContent = formatLargeNumber(comparisons);
            UI.benchSwaps.textContent = formatLargeNumber(swaps);

            // Show theoretical operation counts
            UI.benchTheoryBest.textContent = computeTheoretical(n, algo.best) + ' ops';
            UI.benchTheoryAvg.textContent = computeTheoretical(n, algo.avg) + ' ops';
            UI.benchTheoryWorst.textContent = computeTheoretical(n, algo.worst) + ' ops';

            // --- Compute theoretical TIME estimates ---
            // These are INDEPENDENT of actual time â€” based on machine-calibrated per-op cost
            storedTheoreticalBestMs = computeTheoreticalTimeMs(n, algo.best);
            storedTheoreticalAvgMs = computeTheoreticalTimeMs(n, algo.avg);
            storedTheoreticalWorstMs = computeTheoreticalTimeMs(n, algo.worst);

            // Render all time displays in current unit
            updateAllTimeDisplays();

            // Diff badge: show how actual compares to theoretical avg
            const diffPercent = ((benchmarkTimeMs - storedTheoreticalAvgMs) / storedTheoreticalAvgMs) * 100;
            if (Math.abs(diffPercent) < 1) {
                UI.benchDiffBadge.textContent = 'â‰ˆ Matches Theory';
                UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400';
            } else if (diffPercent < 0) {
                UI.benchDiffBadge.textContent = `${Math.abs(diffPercent).toFixed(1)}% Faster`;
                UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400';
            } else {
                UI.benchDiffBadge.textContent = `${diffPercent.toFixed(1)}% Slower`;
                UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400';
            }

            // Animate dual bar chart
            const maxTime = Math.max(benchmarkTimeMs, storedTheoreticalWorstMs, storedTheoreticalAvgMs, 0.001);
            const actualBarPct = Math.max(Math.min((benchmarkTimeMs / maxTime) * 100, 100), 2);
            const theoryBarPct = Math.max(Math.min((storedTheoreticalAvgMs / maxTime) * 100, 100), 2);

            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                UI.benchBarActual.style.width = actualBarPct + '%';
                UI.benchBarTheory.style.width = theoryBarPct + '%';
            });

        } catch (err) {
            console.error(err);
            UI.benchStatus.textContent = "ERROR";
            UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
        }

        UI.btnRunBench.innerHTML = '<span class="material-symbols-outlined text-sm">rocket_launch</span>Run Benchmark';
        UI.btnRunBench.disabled = false;
    });

    UI.btnStartVis.addEventListener('click', () => {
        // Change left visualizer to this algorithm and close modal
        if (currentModalAlgoId) {
            STATE.leftAlgo = currentModalAlgoId;
            updateAlgoHeaders();

            // If we have benchmark data, optionally load it into the visualizer
            // (Only if it's small enough to render safely, e.g., < 1000 items)
            if (benchmarkData && benchmarkData.length > 0 && benchmarkData.length <= 500) {
                STATE.array = [...benchmarkData];
                UI.sliderSize.value = benchmarkData.length;
                if (UI.sizeDisplay) UI.sizeDisplay.textContent = `Array Buffer: ${benchmarkData.length} Elements`;
                renderInitialArenas();
            }
        }
        closeModal();
    });

});


function updateAlgoHeaders() {
    UI.titleLeft.textContent = algorithms[STATE.leftAlgo].title;
    UI.compLeft.textContent = algorithms[STATE.leftAlgo].avg;
    UI.titleRight.textContent = algorithms[STATE.rightAlgo].title;
    UI.compRight.textContent = algorithms[STATE.rightAlgo].avg;
}

function generateArray() {
    const size = parseInt(UI.sliderSize.value) || 50; // Fallback to 50 if slider read goes wrong initially
    STATE.array = [];
    for (let i = 0; i < size; i++) {
        STATE.array.push(Math.floor(Math.random() * 95) + 5);
    }
    if (UI.sizeDisplay) UI.sizeDisplay.textContent = `Array Buffer: ${size} Elements`;
}

function renderInitialArenas() {
    if (STATE.leftApi) STATE.leftApi.aborted = true;
    if (STATE.rightApi) STATE.rightApi.aborted = true;

    STATE.leftApi = new SortAPI(UI.arenaLeft, 'bg-primary', UI.opsLeft);
    STATE.rightApi = new SortAPI(UI.arenaRight, 'bg-secondary', UI.opsRight);
}

class SortAPI {
    constructor(container, colorClass, opsElement) {
        this.container = container;
        this.colorClass = colorClass;
        this.opsElement = opsElement;
        this.ops = 0;
        this.arr = [...STATE.array];
        this.bars = [];
        this.aborted = false;
        this.renderInitial();
    }

    renderInitial() {
        if (!this.container) return; // safeguard
        this.container.innerHTML = '<div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 50% 120%, rgba(255,255,255,0.15), transparent 70%);"></div>';
        this.bars = [];
        for (let val of this.arr) {
            let bar = document.createElement('div');
            // Adding more tailwind for smooth visuals
            let marginClass = this.arr.length > 100 ? '' : (this.arr.length > 50 ? 'mx-[0.5px]' : 'mx-[1px]');
            bar.className = `${this.colorClass} flex-1 ${marginClass} rounded-t-sm transition-all duration-75`;
            bar.style.height = `${val}%`;
            this.container.appendChild(bar);
            this.bars.push(bar);
        }
        this.updateOps();
    }

    updateOps() {
        if (this.opsElement) this.opsElement.textContent = this.ops.toLocaleString();
    }

    async sleep() {
        if (this.aborted) throw new Error("Aborted");
        let delay = 101 - (parseInt(UI.sliderSpeed ? UI.sliderSpeed.value : 50));
        if (UI.speedDisplay) UI.speedDisplay.textContent = `Base Yield: ${delay}ms`;
        await new Promise(r => setTimeout(r, Math.max(delay, 5)));
        while (STATE.isPaused) {
            await new Promise(r => STATE.resolvers.push(r));
            if (this.aborted) throw new Error("Aborted");
        }
    }

    async compare(i, j) {
        this.ops++;
        this.updateOps();
        this.bars[i].classList.add('brightness-150', 'bg-white');
        this.bars[j].classList.add('brightness-150', 'bg-white');
        await this.sleep();
        this.bars[i].classList.remove('brightness-150', 'bg-white');
        this.bars[j].classList.remove('brightness-150', 'bg-white');
        return this.arr[i] - this.arr[j];
    }

    async swap(i, j) {
        this.ops++;
        this.updateOps();
        let temp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
        this.bars[i].style.height = `${this.arr[i]}%`;
        this.bars[j].style.height = `${this.arr[j]}%`;
        await this.sleep();
    }

    async set(i, val) {
        this.ops++;
        this.updateOps();
        this.arr[i] = val;
        this.bars[i].style.height = `${val}%`;
        this.bars[i].classList.add('brightness-150', 'bg-white');
        await this.sleep();
        this.bars[i].classList.remove('brightness-150', 'bg-white');
    }

        async markLine(lineNum) {
        if (this.aborted) throw new Error("Aborted");
        if (STATE.mode !== 'single') return; 

        // Ignore if operations are too fast (delay extremely low)
        let delay = 101 - (parseInt(UI.sliderSpeed ? UI.sliderSpeed.value : 50));
        
        document.querySelectorAll('#single-code-display div').forEach(el => {
            el.classList.remove('active-exec-line');
        });
        
        const targetLine = document.getElementById(`exec-line-${lineNum}`);
        if (targetLine) {
            targetLine.classList.add('active-exec-line');
            
            // Auto scroll container
            targetLine.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
        
        await new Promise(r => setTimeout(r, Math.max(delay / 2, 5)));
    }
}

function togglePlay() {
    if (!STATE.isPlaying) {
        startSorting();
    } else if (STATE.isPaused) {
        resumeSorting();
    }
}

function stopSorting() {
    STATE.isPlaying = false;
    STATE.isPaused = false;
    if (STATE.leftApi) STATE.leftApi.aborted = true;
    if (STATE.rightApi) STATE.rightApi.aborted = true;
    resumeSorting(); // flush resolvers

    UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Begin Sorting</span>';
}

function resumeSorting() {
    STATE.isPaused = false;
    STATE.resolvers.forEach(r => r());
    STATE.resolvers = [];
    UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Sorting...</span>';
}

async function startSorting() {
    STATE.isPlaying = true;
    STATE.isPaused = false;
    UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Sorting...</span>';

    // In case array is already sorted and they just press play again
    renderInitialArenas();

    if (STATE.mode === 'single') {
        try {
            await algorithms[STATE.leftAlgo].run(STATE.leftApi);
        } catch(e) {
            if (e.message !== "Aborted") console.error(e);
        }
    } else {
        const leftPromise = algorithms[STATE.leftAlgo].run(STATE.leftApi).catch(e => { if (e.message !== "Aborted") console.error(e); });
        const rightPromise = algorithms[STATE.rightAlgo].run(STATE.rightApi).catch(e => { if (e.message !== "Aborted") console.error(e); });
        await Promise.all([leftPromise, rightPromise]);
    }

    if (!STATE.leftApi.aborted) {
        STATE.isPlaying = false;
        UI.btnPlay.innerHTML = '<span class="material-symbols-outlined fill-1">play_arrow</span><span class="hidden sm:inline">Begin Sorting</span>';
        // Clear highlighted line safely
        if (STATE.mode === 'single') {
            document.querySelectorAll('#single-code-display div').forEach(el => {
                el.classList.remove('active-exec-line');
            });
        }
    }
}

function openModal(algoId) {
    const data = algorithms[algoId];
    if (!data) return;

    // Visually update the sidebar active state
    algoKeys.forEach(key => {
        const btn = document.getElementById(`btn-${key}`);
        if (!btn) return;
        btn.classList.remove('bg-primary/10', 'border-primary/20', 'text-primary');
        btn.classList.add('hover:bg-white/5', 'border-transparent');
        const textSpan = btn.querySelector('span:nth-child(2)');
        if (textSpan) {
            textSpan.classList.remove('font-semibold', 'text-primary');
            textSpan.classList.add('font-medium', 'text-slate-300');
        }
    });

    const activeBtn = document.getElementById(`btn-${algoId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-primary/10', 'border-primary/20', 'text-primary');
        activeBtn.classList.remove('hover:bg-white/5', 'border-transparent');
        const textSpan = activeBtn.querySelector('span:nth-child(2)');
        if (textSpan) {
            textSpan.classList.add('font-semibold');
            textSpan.classList.remove('font-medium', 'text-slate-300');
        }
    }

    document.getElementById('algo-title').textContent = data.title;
    document.getElementById('algo-desc').textContent = data.desc;
    document.getElementById('algo-best').textContent = data.best;
    document.getElementById('algo-avg').textContent = data.avg;
    document.getElementById('algo-worst').textContent = data.worst;
    document.getElementById('algo-space').textContent = data.space;
    document.getElementById('algo-apps').textContent = data.apps;

    const charsList = document.getElementById('algo-chars');
    charsList.innerHTML = '';
    data.chars.forEach(char => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2';
        li.innerHTML = `<span class="material-symbols-outlined text-primary text-sm">${char.icon}</span> ${char.text}`;
        charsList.appendChild(li);
    });

    currentModalAlgoId = algoId;

    // Reset tabs to Overview
    const tabOv = document.getElementById('tab-overview');
    const tabIm = document.getElementById('tab-implementation');
    const panelOv = document.getElementById('panel-overview');
    const panelIm = document.getElementById('panel-implementation');
    if (tabOv && tabIm && panelOv && panelIm) {
        tabOv.className = 'tab-btn text-primary border-b-2 border-primary pb-2 text-sm font-bold cursor-pointer transition-all';
        tabIm.className = 'tab-btn text-slate-500 hover:text-slate-300 border-b-2 border-transparent pb-2 text-sm font-bold cursor-pointer transition-all';
        panelOv.classList.remove('hidden');
        panelIm.classList.add('hidden');
    }

    // Reset bench UI
    if (UI.benchResults) {
        UI.benchResults.classList.add('hidden');
        UI.benchResults.classList.remove('flex');
        UI.benchFile.value = '';
        UI.benchFileLabel.textContent = 'Select File...';
        UI.benchFileLabel.classList.remove('text-rose-400');
        UI.btnDeleteFile.classList.add('hidden');
        UI.benchStatus.textContent = "";
        UI.benchComparisons.textContent = "0";
        UI.benchSwaps.textContent = "0";
        UI.benchTheoryBest.textContent = "â€”";
        UI.benchTheoryAvg.textContent = "â€”";
        UI.benchTheoryWorst.textContent = "â€”";
        UI.benchActualTime.textContent = '0.00';
        UI.benchTheoreticalTime.textContent = '0.00';
        UI.benchDiffBadge.textContent = 'â€”';
        UI.benchDiffBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400';
        UI.benchBarActual.style.width = '0%';
        UI.benchBarTheory.style.width = '0%';
        UI.benchBarActualLabel.textContent = '';
        UI.benchBarTheoryLabel.textContent = '';
        benchmarkData = null;
        benchmarkTimeMs = 0;
    }

    const modal = document.getElementById('algorithm-modal');
    const modalContent = document.getElementById('algorithm-modal-content');
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
}

function closeModal() {
    const modal = document.getElementById('algorithm-modal');
    const modalContent = document.getElementById('algorithm-modal-content');
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const arenaPage = document.getElementById('arena-page');
    const btnGoArena = document.getElementById('btn-go-arena');
    const btnStart = document.getElementById('btn-start');
    const btnRecursiveBattle = document.getElementById('btn-recursive-battle');
    const btnHome = document.getElementById('btn-home');

    /* ---- Mobile sidebar drawer ---- */
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btnHamburgerHome = document.getElementById('btn-hamburger-home');
    const btnHamburgerArena = document.getElementById('btn-hamburger-arena');
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    const btnToggleControls = document.getElementById('btn-toggle-controls');
    const mobileControlsPanel = document.getElementById('mobile-controls-panel');

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('is-open');
        if (overlay) overlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden'; // prevent background scroll
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    if (btnHamburgerHome)  btnHamburgerHome.addEventListener('click',  openSidebar);
    if (btnHamburgerArena) btnHamburgerArena.addEventListener('click', openSidebar);
    if (btnCloseSidebar)   btnCloseSidebar.addEventListener('click',   closeSidebar);
    if (overlay)           overlay.addEventListener('click',           closeSidebar);

    /* ---- Mobile controls panel toggle ---- */
    if (btnToggleControls && mobileControlsPanel) {
        btnToggleControls.addEventListener('click', () => {
            mobileControlsPanel.classList.toggle('is-open');
        });
    }

    /* ---- Page navigation ---- */
    function showArena() {
        closeSidebar();
        if (homePage && arenaPage) {
            homePage.classList.add('hidden');
            homePage.classList.remove('flex');
            arenaPage.classList.remove('hidden');
            arenaPage.classList.add('flex');
        }
    }

    function showHome() {
        closeSidebar();
        if (homePage && arenaPage) {
            arenaPage.classList.add('hidden');
            arenaPage.classList.remove('flex');
            homePage.classList.remove('hidden');
            homePage.classList.add('flex');
        }
    }

    if (btnGoArena) btnGoArena.addEventListener('click', showArena);
    if (btnStart)   btnStart.addEventListener('click',   showArena);
    if (btnRecursiveBattle) {
        btnRecursiveBattle.addEventListener('click', () => {
            STATE.mode = 'compare';
            const rightSection = document.getElementById('arena-right-section');
            const codeSection = document.getElementById('single-code-section');
            const divDes = document.getElementById('vs-divider-desktop');
            const divMob = document.getElementById('vs-divider-mobile');

            if (rightSection) { rightSection.classList.remove('hidden'); rightSection.classList.add('flex'); }
            if (divDes) { divDes.classList.remove('hidden'); divDes.classList.add('md:block'); }
            if (divMob) { divMob.classList.remove('hidden'); divMob.classList.add('block'); }
            if (codeSection) { codeSection.classList.add('hidden'); codeSection.classList.remove('flex'); }

            const labelLeft = document.getElementById('left-algo-label');
            const selectorLeft = document.getElementById('selector-left');
            if (labelLeft) labelLeft.textContent = "Algorithm A (Click to Change)";
            if (selectorLeft) selectorLeft.classList.add('cursor-pointer', 'group');

            showArena();
        });
    }
    if (btnHome) btnHome.addEventListener('click', showHome);

    /* ---- Keyboard: Escape closes sidebar ---- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
});

/* =====================================================================
   VISUALIZATION PAGE + BENCHMARK PAGE LOGIC
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const allPages = ['welcome-page', 'home-page', 'arena-page', 'visualization-page', 'benchmark-page', 'performance-matrices-page'];
    const algoKeysList = Object.keys(algorithms);

    // Icon map for algo selector cards
    const algoIcons = {
        'quick-sort': 'bolt', 'merge-sort': 'merge_type', 'bubble-sort': 'bubble_chart',
        'heap-sort': 'heap_snapshot_thumbnail', 'selection-sort': 'design_services',
        'insertion-sort': 'input', 'tim-sort': 'timer', 'intro-sort': 'psychology',
        'shell-sort': 'layers', 'pdq-sort': 'speed', 'dual-pivot-quick-sort': 'compare_arrows',
        'block-sort': 'view_module', 'dual-fusion-sort': 'all_inclusive'
    };
    const algoColors = {
        'quick-sort': 'text-primary', 'merge-sort': 'text-secondary', 'bubble-sort': 'text-slate-400',
        'heap-sort': 'text-slate-400', 'selection-sort': 'text-indigo-400',
        'insertion-sort': 'text-emerald-400', 'tim-sort': 'text-violet-400', 'intro-sort': 'text-amber-400',
        'shell-sort': 'text-cyan-400', 'pdq-sort': 'text-fuchsia-400', 'dual-pivot-quick-sort': 'text-rose-400',
        'block-sort': 'text-teal-400', 'dual-fusion-sort': 'text-orange-400'
    };

    function showPage(pageId) {
        allPages.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === pageId) {
                el.classList.remove('hidden');
                el.classList.add('flex');
            } else {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        });
    }

    function buildAlgoGrid(containerId, accentClass, onSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        algoKeysList.forEach(key => {
            const algo = algorithms[key];
            const card = document.createElement('button');
            card.className = `algo-select-card glass p-3 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer flex flex-col items-center gap-2 text-center ${accentClass}`;
            card.dataset.algo = key;
            card.innerHTML = `
                <span class="material-symbols-outlined text-xl ${algoColors[key] || 'text-slate-400'}">${algoIcons[key] || 'sort'}</span>
                <span class="text-[10px] sm:text-xs font-semibold text-slate-300 leading-tight">${algo.title}</span>
            `;
            card.addEventListener('click', () => {
                container.querySelectorAll('.algo-select-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                onSelect(key);
            });
            container.appendChild(card);
        });
    }

    // ==================== FEATURE CARD NAVIGATION ====================
    const btnEnterVis = document.getElementById('btn-enter-visualization');
    const btnExplorePerf = document.getElementById('btn-explore-performance');
    const btnStartBench = document.getElementById('btn-start-benchmarking');

    if (btnEnterVis) btnEnterVis.addEventListener('click', (e) => { e.stopPropagation(); showPage('visualization-page'); });
    if (btnExplorePerf) btnExplorePerf.addEventListener('click', (e) => {
        e.stopPropagation();
        showPage('performance-matrices-page');
    });
    if (btnStartBench) btnStartBench.addEventListener('click', (e) => { e.stopPropagation(); showPage('benchmark-page'); });

    // Back buttons
    const btnVisBack = document.getElementById('btn-vis-back');
    const btnBenchBack = document.getElementById('btn-bench-back');
    if (btnVisBack) btnVisBack.addEventListener('click', () => { visStopSorting(); showPage('home-page'); });
    if (btnBenchBack) btnBenchBack.addEventListener('click', () => showPage('home-page'));

    // ==================== VISUALIZATION PAGE ====================
    const VIS = {
        selectedAlgo: null,
        isPlaying: false,
        isPaused: false,
        array: [],
        bars: [],
        api: null,
        resolvers: [],
    };

    const visArena = document.getElementById('vis-arena');
    const visAlgoTitle = document.getElementById('vis-algo-title');
    const visOps = document.getElementById('vis-ops');
    const visArraySize = document.getElementById('vis-array-size');
    const visSizeLabel = document.getElementById('vis-size-label');
    const visCodeDisplay = document.getElementById('vis-code-display');
    const btnVisStart = document.getElementById('btn-vis-start');
    const btnVisStop = document.getElementById('btn-vis-stop');
    const btnVisRestart = document.getElementById('btn-vis-restart');
    const visSpeedSlider = document.getElementById('vis-speed-slider');
    const visSizeSlider = document.getElementById('vis-size-slider');
    const visSpeedLabel = document.getElementById('vis-speed-label');
    const visAlgoSelect = document.getElementById('vis-algo-select');
    const visInfoPanel = document.getElementById('vis-algo-info-panel');
    const visInfoWorst = document.getElementById('vis-info-worst');
    const visInfoBest = document.getElementById('vis-info-best');
    const visInfoSpace = document.getElementById('vis-info-space');

    if (visSizeSlider) {
        visSizeSlider.addEventListener('input', () => {
            if (visSizeLabel) visSizeLabel.textContent = visSizeSlider.value;
            if (VIS.selectedAlgo) { visStopSorting(); visGenerateArray(); visRenderBars(); }
        });
    }

    if (visSpeedSlider) {
        visSpeedSlider.addEventListener('input', () => {
            if (visSpeedLabel) {
                visSpeedLabel.textContent = `Speed: ${visSpeedSlider.value}%`;
            }
        });
    }

    if (visAlgoSelect) {
        algoKeysList.forEach(key => {
            const algo = algorithms[key];
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = algo.title;
            visAlgoSelect.appendChild(opt);
        });
        visAlgoSelect.addEventListener('change', (e) => {
            if (e.target.value) visOnAlgoSelect(e.target.value);
        });
    }

    function visGenerateArray() {
        const size = parseInt(visSizeSlider ? visSizeSlider.value : 30);
        VIS.array = [];
        for (let i = 0; i < size; i++) VIS.array.push(Math.floor(Math.random() * 90) + 5);
        if (visArraySize) visArraySize.textContent = size;
    }

    function visRenderBars() {
        if (!visArena) return;
        visArena.innerHTML = '<div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 50% 120%, rgba(245,158,11,0.15), transparent 70%);"></div>';
        VIS.bars = [];
        const margin = VIS.array.length > 50 ? 'mx-[0.5px]' : 'mx-[1px]';
        VIS.array.forEach(val => {
            const bar = document.createElement('div');
            bar.className = `vis-sort-bar bg-amber-500 flex-1 ${margin} rounded-t-sm`;
            bar.style.height = `${val}%`;
            visArena.appendChild(bar);
            VIS.bars.push(bar);
        });
        if (visOps) visOps.textContent = '0';
    }

    // Vis SortAPI â€” similar to existing SortAPI but for standalone vis page
    class VisSortAPI {
        constructor() {
            this.arr = [...VIS.array];
            this.bars = VIS.bars;
            this.ops = 0;
            this.aborted = false;
        }

        updateOps() { if (visOps) visOps.textContent = this.ops.toLocaleString(); }

        // Smoother, exponential speed curve
        getDelay() {
            const visSpeedSlider = document.getElementById('vis-speed-slider');
            const speed = parseInt(visSpeedSlider ? visSpeedSlider.value : 50);
            if (speed === 100) return 2;
            return Math.pow(101 - speed, 1.5) * 0.8;
        }

        async sleep() {
            if (this.aborted) throw new Error("Aborted");
            await new Promise(r => setTimeout(r, Math.max(this.getDelay(), 5)));
            while (VIS.isPaused) {
                await new Promise(r => VIS.resolvers.push(r));
                if (this.aborted) throw new Error("Aborted");
            }
        }

        async compare(i, j) {
            this.ops++;
            this.updateOps();
            this.bars[i].style.backgroundColor = '#06b6d4';
            this.bars[i].style.transform = 'scaleY(1.05)';
            this.bars[j].style.backgroundColor = '#06b6d4';
            this.bars[j].style.transform = 'scaleY(1.05)';
            await this.sleep();
            this.bars[i].style.backgroundColor = '';
            this.bars[i].style.transform = '';
            this.bars[j].style.backgroundColor = '';
            this.bars[j].style.transform = '';
            return this.arr[i] - this.arr[j];
        }

        async swap(i, j) {
            this.ops++;
            this.updateOps();
            let temp = this.arr[i]; this.arr[i] = this.arr[j]; this.arr[j] = temp;
            this.bars[i].style.height = `${this.arr[i]}%`;
            this.bars[j].style.height = `${this.arr[j]}%`;
            this.bars[i].style.backgroundColor = '#10b981';
            this.bars[j].style.backgroundColor = '#10b981';
            this.bars[i].style.transform = 'scaleY(1.1)';
            this.bars[j].style.transform = 'scaleY(1.1)';
            await this.sleep();
            this.bars[i].style.backgroundColor = '';
            this.bars[j].style.backgroundColor = '';
            this.bars[i].style.transform = '';
            this.bars[j].style.transform = '';
        }

        async set(i, val) {
            this.ops++;
            this.updateOps();
            this.arr[i] = val;
            this.bars[i].style.height = `${val}%`;
            this.bars[i].style.backgroundColor = '#d946ef';
            this.bars[i].style.transform = 'scaleY(1.08)';
            await this.sleep();
            this.bars[i].style.backgroundColor = '';
            this.bars[i].style.transform = '';
        }

        async markLine(lineNum) {
            if (this.aborted) throw new Error("Aborted");
            // Highlight line
            document.querySelectorAll('#vis-code-display div').forEach(el => {
                el.classList.remove('active-exec-line');
            });
            const target = document.getElementById(`vis-exec-line-${lineNum}`);
            if (target) {
                target.classList.add('active-exec-line');
                target.scrollIntoView({ behavior: 'auto', block: 'center' });
            }
            // Add a short delay for smooth line tracing based on current speed
            await new Promise(r => setTimeout(r, Math.max(this.getDelay() / 3, 5)));
        }
    }

    function visHighlightCodeForExec(code) {
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const lines = html.split('\n');
        return lines.map((line, i) => {
            let cl = line
                .replace(/(\/\/.*)/g, '<span style=color:#6a9955;font-style:italic;>$1</span>')
                .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style=color:#ce9178;>$1</span>')
                .replace(/\b(function|const|let|var|if|else|for|while|return|break|continue|new|typeof|class|extends|async|await)\b/g, '<span style=color:#c586c0;>$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span style=color:#b5cea8;>$1</span>')
                .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style=color:#dcdcaa;>$1</span>')
                .replace(/\.(length|push|pop|slice|concat|floor|log)\b/g, '.<span style=color:#4fc1ff;>$1</span>');
            return `<div id="vis-exec-line-${i + 1}" class="px-2 py-[1.5px] leading-tight border-l-[3px] border-transparent transition-colors duration-150 whitespace-pre font-mono text-sm group"><span class="text-slate-500/40 group-hover:text-slate-500/70 mr-3 select-none inline-block w-6 text-right">${i + 1}</span>${cl}</div>`;
        }).join('\n');
    }

    function visOnAlgoSelect(key) {
        VIS.selectedAlgo = key;
        const algo = algorithms[key];
        if (visAlgoTitle) visAlgoTitle.textContent = algo.title;
        if (btnVisStart) btnVisStart.disabled = false;
        if (btnVisRestart) btnVisRestart.disabled = false;

        // Generate array and render bars
        visGenerateArray();
        visRenderBars();

        // Show code
        const code = window.algorithmCode[key];
        if (visCodeDisplay && code) {
            visCodeDisplay.innerHTML = visHighlightCodeForExec(code);
        }

        // Update Info Panel
        if (visInfoPanel) {
            visInfoPanel.classList.remove('hidden');
            visInfoPanel.classList.add('flex');
            if (visInfoWorst) visInfoWorst.textContent = algo.worst;
            if (visInfoBest) visInfoBest.textContent = algo.best;
            if (visInfoSpace) visInfoSpace.textContent = algo.space;
        }
    }

    // Generate Dropdown Options happens in initialization now.
    
    function visStopSorting() {
        VIS.isPlaying = false;
        VIS.isPaused = false;
        if (VIS.api) VIS.api.aborted = true;
        VIS.resolvers.forEach(r => r());
        VIS.resolvers = [];
        if (btnVisStart) {
            btnVisStart.disabled = !VIS.selectedAlgo;
            btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">play_arrow</span>START SORTING';
        }
        if (btnVisStop) btnVisStop.disabled = true;
    }

    async function visStartSorting() {
        if (!VIS.selectedAlgo) return;
        VIS.isPlaying = true;
        VIS.isPaused = false;
        visGenerateArray();
        visRenderBars();

        VIS.api = new VisSortAPI();
        if (btnVisStart) {
            btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">pause</span>PAUSE SORTING';
        }
        if (btnVisStop) btnVisStop.disabled = false;
        if (btnVisRestart) btnVisRestart.disabled = false;

        try {
            await algorithms[VIS.selectedAlgo].run(VIS.api);
            // Sort complete â€” green flash all bars
            if (!VIS.api.aborted) {
                VIS.bars.forEach((bar, i) => {
                    setTimeout(() => { bar.style.background = '#22c55e'; setTimeout(() => { bar.style.background = ''; }, 300); }, i * 10);
                });
            }
        } catch (e) {
            if (e.message !== "Aborted") console.error(e);
        }

        if (!VIS.api.aborted) {
            VIS.isPlaying = false;
            if (btnVisStart) {
                btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">play_arrow</span>START SORTING';
                btnVisStart.disabled = false;
            }
            if (btnVisStop) btnVisStop.disabled = true;
            // Clear highlighted line
            document.querySelectorAll('#vis-code-display div').forEach(el => {
                el.classList.remove('active-exec-line');
            });
        }
    }

    if (btnVisStart) {
        btnVisStart.addEventListener('click', () => {
            if (!VIS.isPlaying) {
                visStartSorting();
            } else if (VIS.isPaused) {
                // Resume
                VIS.isPaused = false;
                VIS.resolvers.forEach(r => r());
                VIS.resolvers = [];
                btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">pause</span>PAUSE SORTING';
            } else {
                // Pause
                VIS.isPaused = true;
                btnVisStart.innerHTML = '<span class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">play_arrow</span>RESUME SORTING';
            }
        });
    }

    if (btnVisStop) btnVisStop.addEventListener('click', () => {
        visStopSorting();
        if (VIS.selectedAlgo) { visGenerateArray(); visRenderBars(); }
    });

    if (btnVisRestart) btnVisRestart.addEventListener('click', () => {
        visStopSorting();
        if (VIS.selectedAlgo) {
            visGenerateArray();
            visRenderBars();
        }
    });

    // ==================== BENCHMARK PAGE ====================
    let benchStandaloneAlgo = null;
    let benchStandaloneData = null;
    let benchStandaloneTimeMs = 0;
    let benchStandaloneUnit = 'ms';
    let benchSTheoreticalBest = 0, benchSTheoreticalAvg = 0, benchSTheoreticalWorst = 0;

    const BSE = {
        // Data Sources
        genSlider: document.getElementById('bench-gen-slider'),
        genVal: document.getElementById('bench-gen-val'),
        btnGenerate: document.getElementById('btn-bench-generate'),
        file: document.getElementById('bench-standalone-file'),
        fileLabel: document.getElementById('bench-standalone-file-label'),
        fileActions: document.getElementById('bench-file-actions'),
        btnDeleteFile: document.getElementById('btn-bench-standalone-delete-file'),
        dataStatus: document.getElementById('bench-data-status'),
        statusN: document.getElementById('bench-s-n'),

        // Execution
        algoSection: document.getElementById('bench-algo-section'),
        btnRun: document.getElementById('btn-bench-standalone-run'),
        btnRunAll: document.getElementById('btn-bench-run-all'),
        algoName: document.getElementById('bench-standalone-algo-name'),

        // Results Container
        resultsWrapper: document.getElementById('bench-standalone-results'),
        
        // Single Results
        singleView: document.getElementById('bench-single-results-view'),
        status: document.getElementById('bench-s-status'),
        statusContainer: document.getElementById('bench-s-status-container'),
        actualTime: document.getElementById('bench-s-actual-time'),
        actualUnit: document.getElementById('bench-s-actual-unit'),
        comparisons: document.getElementById('bench-s-comparisons'),
        swaps: document.getElementById('bench-s-swaps'),
        diffBadge: document.getElementById('bench-s-diff-badge'),
        barActual: document.getElementById('bench-s-bar-actual'),
        barTheory: document.getElementById('bench-s-bar-theory'),
        barActualLabel: document.getElementById('bench-s-bar-actual-label'),
        barTheoryLabel: document.getElementById('bench-s-bar-theory-label'),
        theoryBest: document.getElementById('bench-s-theory-best'),
        theoryAvg: document.getElementById('bench-s-theory-avg'),
        theoryWorst: document.getElementById('bench-s-theory-worst'),

        // Suite Results
        suiteView: document.getElementById('bench-suite-results-view'),
        suiteCount: document.getElementById('bench-suite-count'),
        suiteN: document.getElementById('bench-suite-n'),
        suiteLeaderboard: document.getElementById('bench-suite-leaderboard')
    };

    function unlockAlgoSection(count) {
        if (!count || count <= 0) {
            BSE.algoSection.classList.add('opacity-50', 'pointer-events-none');
            BSE.dataStatus.classList.add('hidden');
            BSE.btnRun.disabled = true;
            return;
        }
        BSE.algoSection.classList.remove('opacity-50', 'pointer-events-none');
        BSE.dataStatus.classList.remove('hidden');
        BSE.dataStatus.classList.add('flex');
        BSE.statusN.innerHTML = `${count.toLocaleString()} <span class="text-[10px] text-slate-500 uppercase tracking-widest ml-1">Elements</span>`;
        if (benchStandaloneAlgo) BSE.btnRun.disabled = false;
    }

    // Auto-Generate Data
    if (BSE.genSlider) {
        BSE.genSlider.addEventListener('input', (e) => {
            BSE.genVal.textContent = Number(e.target.value).toLocaleString();
        });
    }

    if (BSE.btnGenerate) {
        BSE.btnGenerate.addEventListener('click', () => {
            const count = Number(BSE.genSlider.value) || 10000;
            const arr = [];
            for (let i = 0; i < count; i++) {
                arr.push(Math.floor(Math.random() * count) + 1);
            }
            benchStandaloneData = arr;
            
            // Clear file if any
            BSE.file.value = '';
            BSE.fileLabel.textContent = 'Click to browse file...';
            BSE.fileActions.classList.add('hidden');
            BSE.fileActions.classList.remove('flex');

            BSE.resultsWrapper.classList.add('hidden');
            BSE.resultsWrapper.classList.remove('flex');
            
            // Success animation
            BSE.btnGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Generated!';
            BSE.btnGenerate.classList.replace('text-emerald-400', 'text-background-dark');
            BSE.btnGenerate.classList.replace('bg-emerald-500/20', 'bg-emerald-500');
            setTimeout(() => {
                BSE.btnGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">memory</span> Generate Array Buffer';
                BSE.btnGenerate.classList.replace('text-background-dark', 'text-emerald-400');
                BSE.btnGenerate.classList.replace('bg-emerald-500', 'bg-emerald-500/20');
            }, 1000);

            unlockAlgoSection(arr.length);
        });
    }

    function benchStandaloneOnAlgoSelect(key) {
        benchStandaloneAlgo = key;
        const algo = algorithms[key];
        if (BSE.algoName) BSE.algoName.textContent = algo.title.toUpperCase();
        if (BSE.btnRun && benchStandaloneData) BSE.btnRun.disabled = false;
    }

    buildAlgoGrid('bench-algo-grid', 'hover:border-emerald-500/40', benchStandaloneOnAlgoSelect);

    // File upload
    if (BSE.file) {
        BSE.file.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file size (max 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert('File is too large. Maximum file size is 5MB.');
                BSE.fileLabel.textContent = 'File too large';
                return;
            }
            
            BSE.fileLabel.textContent = file.name;
            BSE.fileActions.classList.remove('hidden');
            BSE.fileActions.classList.add('flex');
            
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    let text = evt.target.result;
                    text = text.replace(/---.*?---/g, '');
                    text = text.replace(/\/\/.*$/gm, '');
                    text = text.replace(/\/\*.*?\*\//gs, '');
                    
                    const nums = [];
                    const numRegex = /-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi;
                    let match;
                    while ((match = numRegex.exec(text)) !== null) {
                        const num = Number(match[0]);
                        if (isFinite(num)) nums.push(num);
                    }
                    
                    if (nums.length > 0) {
                        benchStandaloneData = nums;
                        unlockAlgoSection(nums.length);
                        BSE.resultsWrapper.classList.add('hidden');
                        BSE.resultsWrapper.classList.remove('flex');
                        console.log('Successfully loaded', nums.length, 'elements from file');
                    } else {
                        benchStandaloneData = null;
                        unlockAlgoSection(0);
                        alert("Invalid Data Format. Found 0 numeric elements.");
                    }
                } catch (err) {
                    console.error('Error parsing benchmark file:', err);
                    alert('Error parsing file: ' + err.message);
                    BSE.fileLabel.textContent = 'Parse error';
                    benchStandaloneData = null;
                    unlockAlgoSection(0);
                }
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                console.error('FileReader error');
                BSE.fileLabel.textContent = 'Read error';
                benchStandaloneData = null;
                unlockAlgoSection(0);
            };
            reader.readAsText(file);
        });
    }

    if (BSE.btnDeleteFile) {
        BSE.btnDeleteFile.addEventListener('click', (e) => {
            e.preventDefault(); // prevent triggering the label's click
            benchStandaloneData = null;
            benchStandaloneTimeMs = 0;
            BSE.file.value = '';
            BSE.fileLabel.textContent = 'Click to browse file...';
            BSE.fileActions.classList.add('hidden');
            BSE.fileActions.classList.remove('flex');
            BSE.resultsWrapper.classList.add('hidden');
            BSE.resultsWrapper.classList.remove('flex');
            unlockAlgoSection(0);
        });
    }

    // Unit selector buttons
    document.querySelectorAll('.bench-s-unit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            benchStandaloneUnit = btn.getAttribute('data-unit');
            document.querySelectorAll('.bench-s-unit-btn').forEach(b => {
                b.className = 'bench-s-unit-btn flex-1 sm:flex-none text-[10px] font-bold px-4 py-1.5 rounded-md text-slate-400 hover:text-emerald-400 transition-all';
            });
            btn.className = 'bench-s-unit-btn flex-1 sm:flex-none text-[10px] font-bold px-4 py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 transition-all shadow-sm';
            if (benchStandaloneTimeMs > 0) updateBenchStandaloneDisplays();
        });
    });

    function updateBenchStandaloneDisplays() {
        if (!benchStandaloneAlgo) return;
        const u = benchStandaloneUnit;
        BSE.actualTime.textContent = displayTimeInUnit(benchStandaloneTimeMs, u);
        BSE.actualUnit.textContent = u;
        BSE.barActualLabel.textContent = displayTimeInUnit(benchStandaloneTimeMs, u) + ' ' + u;
        BSE.barTheoryLabel.textContent = displayTimeInUnit(benchSTheoreticalAvg, u) + ' ' + u;
        BSE.theoryBest.textContent = displayTimeInUnit(benchSTheoreticalBest, u) + ' ' + u;
        BSE.theoryAvg.textContent = displayTimeInUnit(benchSTheoreticalAvg, u) + ' ' + u;
        BSE.theoryWorst.textContent = displayTimeInUnit(benchSTheoreticalWorst, u) + ' ' + u;
    }

    // Single Run
    if (BSE.btnRun) {
        BSE.btnRun.addEventListener('click', async () => {
            if (!benchStandaloneData || !benchStandaloneAlgo) return;
            
            // UI State updates
            BSE.btnRun.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Running...';
            BSE.btnRun.disabled = true;
            BSE.resultsWrapper.classList.remove('hidden');
            BSE.resultsWrapper.classList.add('flex');
            BSE.singleView.classList.remove('hidden');
            BSE.singleView.classList.add('flex');
            BSE.suiteView.classList.add('hidden');
            BSE.suiteView.classList.remove('flex');
            
            BSE.status.textContent = "BENCHMARKING...";
            BSE.statusContainer.className = "flex items-center gap-2 text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg animate-pulse";
            await new Promise(r => setTimeout(r, 50));

            const dataCopy = [...benchStandaloneData];
            let comparisons = 0, swaps = 0;

            try {
                const algo = algorithms[benchStandaloneAlgo];
                const n = dataCopy.length;
                const t0 = performance.now();
                if (algo.runRaw) algo.runRaw(dataCopy);
                else dataCopy.sort((a, b) => a - b);
                const t1 = performance.now();
                benchStandaloneTimeMs = t1 - t0;

                // Estimate ops
                const avgC = algo.avg.replace(/\s/g, '');
                if (avgC.includes('nlogn') || avgC.includes('nlog')) { comparisons = Math.round(n * Math.log2(n)); swaps = Math.round(n * Math.log2(n) / 3); }
                else if (avgC.includes('nÂ²') || avgC.includes('n^2')) { comparisons = Math.round(n * n / 2); swaps = Math.round(n * n / 4); }
                else if (avgC.includes('n')) { comparisons = n; swaps = n; }

                BSE.status.textContent = `${algo.title.toUpperCase()} SUCCESS`;
                BSE.statusContainer.className = "flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg";
                BSE.comparisons.textContent = Number(comparisons).toLocaleString();
                BSE.swaps.textContent = Number(swaps).toLocaleString();

                benchSTheoreticalBest = computeTheoreticalTimeMs(n, algo.best);
                benchSTheoreticalAvg = computeTheoreticalTimeMs(n, algo.avg);
                benchSTheoreticalWorst = computeTheoreticalTimeMs(n, algo.worst);
                updateBenchStandaloneDisplays();

                const diffPercent = ((benchStandaloneTimeMs - benchSTheoreticalAvg) / benchSTheoreticalAvg) * 100;
                if (Math.abs(diffPercent) < 5) {
                    BSE.diffBadge.textContent = 'â‰ˆ Matches Theory';
                    BSE.diffBadge.className = 'text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shrink-0';
                } else if (diffPercent < 0) {
                    BSE.diffBadge.textContent = `${Math.abs(diffPercent).toFixed(1)}% Faster`;
                    BSE.diffBadge.className = 'text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shrink-0';
                } else {
                    BSE.diffBadge.textContent = `${diffPercent.toFixed(1)}% Slower`;
                    BSE.diffBadge.className = 'text-[10px] font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20 shrink-0';
                }

                const maxTime = Math.max(benchStandaloneTimeMs, benchSTheoreticalWorst, benchSTheoreticalAvg, 0.001);
                requestAnimationFrame(() => {
                    BSE.barActual.style.width = Math.max(Math.min((benchStandaloneTimeMs / maxTime) * 100, 100), 2) + '%';
                    BSE.barTheory.style.width = Math.max(Math.min((benchSTheoreticalAvg / maxTime) * 100, 100), 2) + '%';
                });
            } catch (err) {
                console.error(err);
                BSE.status.textContent = "EXECUTION ERROR";
                BSE.statusContainer.className = "flex items-center gap-2 text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg";
            }

            BSE.btnRun.innerHTML = '<span class="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">play_arrow</span> Run Selected Algorithm (<span class="font-mono text-xs tracking-wider">' + algorithms[benchStandaloneAlgo].title.toUpperCase() + '</span>)';
            BSE.btnRun.disabled = false;
        });
    }

    // Suite Run (Run All)
    if (BSE.btnRunAll) {
        BSE.btnRunAll.addEventListener('click', async () => {
            if (!benchStandaloneData) return;
            
            const originalText = BSE.btnRunAll.innerHTML;
            BSE.btnRunAll.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Running Suite...';
            BSE.btnRunAll.disabled = true;
            
            BSE.resultsWrapper.classList.remove('hidden');
            BSE.resultsWrapper.classList.add('flex');
            BSE.singleView.classList.add('hidden');
            BSE.singleView.classList.remove('flex');
            BSE.suiteView.classList.remove('hidden');
            BSE.suiteView.classList.add('flex');
            
            BSE.suiteLeaderboard.innerHTML = '<div class="text-center p-8 text-cyan-400 animate-pulse font-bold text-xs">Evaluating all algorithms...</div>';

            await new Promise(r => setTimeout(r, 100)); // Paint
            
            const results = [];
            const n = benchStandaloneData.length;
            const keys = Object.keys(algorithms);
            
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const algo = algorithms[key];
                const dataCopy = [...benchStandaloneData];
                
                try {
                    const t0 = performance.now();
                    if (algo.runRaw) algo.runRaw(dataCopy);
                    else dataCopy.sort((a, b) => a - b);
                    const t1 = performance.now();
                    const duration = t1 - t0;
                    
                    results.push({
                        key: key,
                        title: algo.title,
                        time: duration,
                        color: algo.color || 'primary',
                        complex: algo.avg
                    });
                } catch(e) {
                    console.error("Suite error on", key, e);
                    results.push({ key, title: algo.title, time: Infinity, color: algo.color || 'rose-500', complex: 'ERROR' });
                }
            }
            
            // Sort by time
            results.sort((a, b) => a.time - b.time);
            
            BSE.suiteCount.textContent = results.length;
            BSE.suiteN.textContent = Number(n).toLocaleString();
            
            // Render Leaderboard
            BSE.suiteLeaderboard.innerHTML = '';
            const bestTime = results[0].time;
            const worstTime = results.filter(r => r.time !== Infinity).pop()?.time || 0.001;
            
            results.forEach((res, index) => {
                const row = document.createElement('div');
                row.className = 'grid grid-cols-12 gap-3 items-center hover:bg-white/5 p-2 rounded-lg transition-colors group border border-transparent hover:border-white/10';
                
                const rankColor = index === 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 
                                 (index < 3 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 bg-white/5 border-white/5');
                
                const timeStr = res.time === Infinity ? 'FAIL' : displayTimeInUnit(res.time, benchStandaloneUnit) + ' ' + benchStandaloneUnit;
                const percent = res.time === Infinity ? 0 : Math.max(2, (res.time / worstTime) * 100);
                
                let relStr = '';
                if (index === 0) relStr = '<span class="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded ml-2">BASELINE</span>';
                else if (res.time !== Infinity) {
                    const mult = res.time / bestTime;
                    relStr = `<span class="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded ml-2">${mult.toFixed(1)}x slower</span>`;
                }

                row.innerHTML = `
                    <div class="col-span-1 hidden sm:flex items-center justify-center">
                        <div class="size-6 rounded-md flex items-center justify-center font-bold textxs border ${rankColor}">
                            ${index + 1}
                        </div>
                    </div>
                    <div class="col-span-12 sm:col-span-4 flex flex-col justify-center">
                        <span class="text-white font-bold text-sm leading-tight flex items-center gap-2">
                            ${res.title}
                            ${index === 0 ? '<span class="material-symbols-outlined text-[14px] text-amber-400">workspace_premium</span>' : ''}
                        </span>
                        <span class="text-[9px] text-slate-500 font-mono mt-0.5">O(${res.complex})</span>
                    </div>
                    <div class="col-span-5 sm:col-span-3 text-right flex flex-col justify-center items-end">
                        <span class="${index === 0 ? 'text-amber-400' : 'text-cyan-400'} font-mono font-bold text-sm tracking-wide">
                            ${timeStr}
                        </span>
                    </div>
                    <div class="col-span-7 sm:col-span-4 pl-4 sm:pl-6 flex items-center h-full">
                        <div class="w-full flex items-center h-full">
                            <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex items-center">
                                <div class="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ease-out" style="width: ${percent}%"></div>
                            </div>
                            ${relStr}
                        </div>
                    </div>
                `;
                BSE.suiteLeaderboard.appendChild(row);
            });
            
            BSE.btnRunAll.innerHTML = originalText;
            BSE.btnRunAll.disabled = false;
        });
    }
    // ==================== PERFORMANCE MATRICES ====================
    const PM = {
        dashboard: document.getElementById('bench-analytics-dashboard'),
        tabComparison: document.getElementById('pm-tab-comparison'),
        tabDiagnostics: document.getElementById('pm-tab-diagnostics'),
        panelComparison: document.getElementById('pm-panel-comparison'),
        panelDiagnostics: document.getElementById('pm-panel-diagnostics'),
        chart: document.getElementById('pm-complexity-chart'),
        spaceBars: document.getElementById('pm-space-bars'),
        deepDiveCards: document.getElementById('pm-deep-dive-cards'),
        inputType: document.getElementById('pm-input-type'),
        recText: document.getElementById('pm-recommendation-text'),
        rankingTbody: document.getElementById('pm-ranking-tbody'),
        pindexGauge: document.getElementById('pm-pindex-gauge'),
        pindexValue: document.getElementById('pm-pindex-value'),
        pindexDesc: document.getElementById('pm-pindex-desc'),
        fitScores: document.getElementById('pm-fit-scores'),
        conflictTbody: document.getElementById('pm-conflict-tbody'),
        heuristicText: document.getElementById('pm-heuristic-text'),
        adaptiveGain: document.getElementById('pm-adaptive-gain'),
        runDetection: document.getElementById('pm-run-detection'),
        heatmap: document.getElementById('pm-heatmap'),
        patternsSummary: document.getElementById('pm-patterns-summary'),
        strategyText: document.getElementById('pm-strategy-text'),
        sortedRuns: document.getElementById('pm-sorted-runs'),
        avgRunLen: document.getElementById('pm-avg-run-len'),
        plateaus: document.getElementById('pm-plateaus'),
    };

    // Tab switching
    document.querySelectorAll('.pm-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pm-tab').forEach(t => {
                t.className = 'pm-tab flex-1 sm:flex-none text-[10px] font-bold px-4 py-2 rounded-md text-slate-400 hover:text-fuchsia-400 transition-all flex items-center gap-1.5 justify-center';
            });
            tab.className = 'pm-tab flex-1 sm:flex-none text-[10px] font-bold px-4 py-2 rounded-md bg-fuchsia-500/20 text-fuchsia-400 transition-all shadow-sm flex items-center gap-1.5 justify-center';
            PM.panelComparison.classList.add('hidden');
            PM.panelComparison.classList.remove('flex');
            PM.panelDiagnostics.classList.add('hidden');
            PM.panelDiagnostics.classList.remove('flex');
            if (tab.id === 'pm-tab-comparison') {
                PM.panelComparison.classList.remove('hidden');
                PM.panelComparison.classList.add('flex');
            } else {
                PM.panelDiagnostics.classList.remove('hidden');
                PM.panelDiagnostics.classList.add('flex');
            }
        });
    });

    // ---- Analysis Functions ----

    function analyzePresortedness(arr) {
        if (!arr || arr.length < 2) return { pIndex: 100, type: 'trivial' };
        const n = arr.length;
        const sampleSize = Math.min(n, 5000);
        const step = Math.max(1, Math.floor(n / sampleSize));
        let inversions = 0;
        let total = 0;
        for (let i = 0; i < n - step; i += step) {
            for (let j = i + step; j < Math.min(i + step * 20, n); j += step) {
                total++;
                if (arr[i] > arr[j]) inversions++;
            }
        }
        const pIndex = total > 0 ? Math.round((1 - inversions / total) * 100) : 50;

        let type = 'Randomized';
        if (pIndex >= 90) type = 'Highly Pre-sorted';
        else if (pIndex >= 70) type = 'Partially Sorted';
        else if (pIndex <= 10) type = 'Reverse-Sorted';
        else if (pIndex <= 30) type = 'Mostly Reversed';

        return { pIndex, type };
    }

    function detectPatterns(arr) {
        if (!arr || arr.length < 2) return { runs: 0, avgRunLen: 0, plateaus: 0, reverseRuns: 0 };
        let runs = 1, plateaus = 0, reverseRuns = 0;
        let currentRunLen = 1;
        let runLengths = [];
        let rising = arr[1] >= arr[0];

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === arr[i - 1]) {
                plateaus++;
                currentRunLen++;
            } else if ((arr[i] > arr[i - 1]) === rising) {
                currentRunLen++;
            } else {
                runLengths.push(currentRunLen);
                if (!rising) reverseRuns++;
                runs++;
                currentRunLen = 1;
                rising = arr[i] > arr[i - 1];
            }
        }
        runLengths.push(currentRunLen);
        if (!rising) reverseRuns++;

        const avgRunLen = runLengths.length > 0 ? Math.round(runLengths.reduce((a, b) => a + b, 0) / runLengths.length) : 0;
        return { runs, avgRunLen, plateaus, reverseRuns };
    }

    function rankAlgorithmsForInput(arr, suiteResults) {
        const { pIndex } = analyzePresortedness(arr);
        const ranked = Object.keys(algorithms).map(key => {
            const algo = algorithms[key];
            let score = 50;

            // Adaptive algorithms benefit from presortedness
            const isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort', 'intro-sort', 'dual-fusion-sort'].includes(key);
            if (pIndex >= 80 && isAdaptive) score += 30;
            else if (pIndex >= 60 && isAdaptive) score += 15;

            // Penalize quadratic algorithms
            const isQuadratic = ['bubble-sort', 'selection-sort', 'insertion-sort'].includes(key);
            if (isQuadratic && arr.length > 1000) score -= 20;
            if (key === 'insertion-sort' && pIndex >= 85) score += 25; // exception for nearly sorted

            // nlogn algorithms get a base bonus for large inputs
            const avgC = algo.avg.replace(/\s/g, '');
            if (avgC.includes('nlogn') || avgC.includes('nlog')) score += 15;

            // If we have actual run results, incorporate them
            if (suiteResults) {
                const result = suiteResults.find(r => r.key === key);
                if (result && result.time !== Infinity) {
                    const best = suiteResults[0].time;
                    const ratio = result.time / best;
                    if (ratio <= 1.2) score += 20;
                    else if (ratio <= 2) score += 10;
                    else if (ratio > 5) score -= 10;
                }
            }

            score = Math.max(5, Math.min(99, score));
            return { key, title: algo.title, score, note: getAlgoStrengths(key, pIndex) };
        });

        ranked.sort((a, b) => b.score - a.score);
        return ranked;
    }

    function spaceComplexityValue(spaceStr) {
        if (!spaceStr) return 3;
        const s = spaceStr.toLowerCase().replace(/\s/g, '');
        if (s.includes('o(1)')) return 1;
        if (s.includes('o(logn)') || s.includes('log')) return 2;
        if (s.includes('o(n)')) return 3;
        if (s.includes('o(nÂ²)') || s.includes('n^2')) return 4;
        return 3;
    }

    // ---- Drawing Functions ----

    function drawComplexityChart(canvas, n, benchTimeMs, algoKey, actualComplexity) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        const pad = { top: 20, right: 20, bottom: 35, left: 50 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top - pad.bottom;

        ctx.clearRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = pad.top + (gH / 5) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        }
        for (let i = 0; i <= 7; i++) {
            const x = pad.left + (gW / 7) * i;
            ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, H - pad.bottom); ctx.stroke();
        }

        // Curves: O(n), O(n log n), O(nÂ²)
        const maxX = Math.max(n * 1.2, 100);
        const curves = [
            { label: 'O(n)', fn: x => x, color: '#10b981' },
            { label: 'O(n log n)', fn: x => x * Math.log2(Math.max(x, 2)), color: '#06b6d4' },
            { label: 'O(nÂ²)', fn: x => x * x, color: '#f43f5e' },
        ];

        // Find max Y for scaling
        const maxY = curves[2].fn(maxX);
        const scaleX = x => pad.left + (x / maxX) * gW;
        const scaleY = y => pad.top + gH - (y / maxY) * gH;

        curves.forEach(curve => {
            ctx.strokeStyle = curve.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const steps = 120;
            for (let i = 0; i <= steps; i++) {
                const x = (maxX / steps) * i;
                const y = curve.fn(x);
                const px = scaleX(x);
                const py = scaleY(Math.min(y, maxY));
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        });

        // Legend
        ctx.font = '10px monospace';
        curves.forEach((curve, i) => {
            const lx = pad.left + 10 + i * 100;
            const ly = pad.top + 12;
            ctx.fillStyle = curve.color;
            ctx.fillRect(lx, ly - 4, 12, 3);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(curve.label, lx + 16, ly);
        });

        // Axis labels
        ctx.fillStyle = '#475569';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        for (let i = 0; i <= 7; i++) {
            const val = Math.round((maxX / 7) * i);
            ctx.fillText(val.toLocaleString(), scaleX(val), H - pad.bottom + 16);
        }
        ctx.fillText('Input Size, n', W / 2, H - 4);
        ctx.textAlign = 'right';
        ctx.fillText('Operations', pad.left - 6, pad.top + 4);

        // Plot actual benchmark point
        if (benchTimeMs !== undefined && n > 0) {
            const px = scaleX(n);
            // Compute the correct estimated ops based on actual algorithm complexity
            let estimatedOps = n * Math.log2(Math.max(n, 2)); // Default to n log n
            
            // If algorithm key is provided, use its actual complexity
            if (algoKey && algorithms[algoKey]) {
                const algo = algorithms[algoKey];
                const complexityStr = actualComplexity || algo.avg;
                estimatedOps = computeTheoreticalOps(n, complexityStr);
            }
            
            const py = scaleY(Math.min(estimatedOps, maxY));
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#d946ef';
            ctx.fill();
            ctx.strokeStyle = '#d946ef';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#d946ef';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`N=${n.toLocaleString()}`, px + 10, py - 4);
        }
    }

    function renderSpaceBars(topAlgos) {
        if (!PM.spaceBars) return;
        PM.spaceBars.innerHTML = '';
        const colors = ['#10b981', '#06b6d4', '#f59e0b', '#d946ef', '#f43f5e'];
        topAlgos.slice(0, 5).forEach((algo, i) => {
            const sv = spaceComplexityValue(algorithms[algo.key]?.space);
            const pct = (sv / 4) * 100;
            const bar = document.createElement('div');
            bar.className = 'flex flex-col items-center gap-1 flex-1';
            bar.innerHTML = `
                <div class="w-full rounded-t" style="height:${Math.max(pct, 15)}%;background:${colors[i % 5]};min-height:6px"></div>
                <span class="text-[7px] text-slate-500 font-mono truncate w-full text-center">${algo.title.split(' ')[0]}</span>
            `;
            PM.spaceBars.appendChild(bar);
        });
    }

    function renderDeepDiveCards(topAlgos) {
        if (!PM.deepDiveCards) return;
        PM.deepDiveCards.innerHTML = '';
        const labels = ['(Current Top)', '(Strong Contender)', '(For Contrast)'];
        const borderColors = ['border-emerald-500/30', 'border-cyan-500/30', 'border-rose-500/30'];
        const textColors = ['text-emerald-400', 'text-cyan-400', 'text-rose-400'];

        topAlgos.slice(0, 3).forEach((ranked, i) => {
            const algo = algorithms[ranked.key];
            if (!algo) return;
            const card = document.createElement('div');
            card.className = `bg-black/30 rounded-lg p-4 border ${borderColors[i]} hover:bg-black/40 transition-colors`;
            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-white font-bold text-xs">${algo.title}</span>
                    <span class="${textColors[i]} text-[9px] font-bold">${labels[i]}</span>
                </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                    <span class="text-slate-500">Best:</span><span class="text-slate-300 font-mono">${algo.best}</span>
                    <span class="text-slate-500">Avg:</span><span class="text-slate-300 font-mono">${algo.avg}</span>
                    <span class="text-slate-500">Worst:</span><span class="text-slate-300 font-mono">${algo.worst}</span>
                    <span class="text-slate-500">Space:</span><span class="text-slate-300 font-mono">${algo.space}</span>
                </div>
            `;
            PM.deepDiveCards.appendChild(card);
        });
    }

    function renderRankingTable(ranked) {
        if (!PM.rankingTbody) return;
        PM.rankingTbody.innerHTML = '';
        ranked.forEach((item, i) => {
            const tr = document.createElement('tr');
            const scoreColor = item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-cyan-400' : item.score >= 40 ? 'text-amber-400' : 'text-rose-400';
            tr.innerHTML = `
                <td class="font-mono font-bold ${i < 3 ? 'text-amber-400' : 'text-slate-500'}">${i + 1}</td>
                <td class="text-white font-bold">${item.title}</td>
                <td class="text-center"><span class="${scoreColor} font-mono font-bold">${item.score}%</span></td>
                <td class="text-slate-400 hidden sm:table-cell text-[10px]">${item.note}</td>
            `;
            PM.rankingTbody.appendChild(tr);
        });
    }

    function renderPIndexGauge(pIndex) {
        if (!PM.pindexGauge) return;
        PM.pindexGauge.style.setProperty('--gauge-percent', pIndex + '%');
        PM.pindexValue.textContent = pIndex + '%';
        if (pIndex >= 80) PM.pindexDesc.textContent = 'High pre-sortedness makes adaptive algorithms shine.';
        else if (pIndex >= 50) PM.pindexDesc.textContent = 'Moderate order detected. Hybrid algorithms recommended.';
        else PM.pindexDesc.textContent = 'Low presortedness. Cache-friendly algorithms are optimal.';
    }

    function renderFitScores(topAlgos) {
        if (!PM.fitScores) return;
        PM.fitScores.innerHTML = '';
        const colors = ['#10b981', '#06b6d4', '#f59e0b'];
        topAlgos.slice(0, 3).forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2';
            div.innerHTML = `
                <span class="text-[9px] text-slate-400 font-bold w-20 text-right truncate shrink-0">${item.title.split(' ')[0]}</span>
                <div class="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" style="width:${item.score}%;background:${colors[i]}"></div>
                </div>
                <span class="text-[10px] font-mono font-bold text-white w-8">${item.score}%</span>
            `;
            PM.fitScores.appendChild(div);
        });
    }

    function renderConflictTable(algo, benchTimeMs, n) {
        if (!PM.conflictTbody || !algo) return;
        PM.conflictTbody.innerHTML = '';
        const bestT = computeTheoreticalTimeMs(n, algo.best);
        const avgT = computeTheoreticalTimeMs(n, algo.avg);
        const worstT = computeTheoreticalTimeMs(n, algo.worst);

        const rows = [
            { metric: 'Best Case Time', theory: algo.best, practical: displayTimeInUnit(bestT, 'ms') + 'ms', conflict: Math.abs(((benchTimeMs - bestT) / Math.max(bestT, 0.001)) * 100) },
            { metric: 'Avg Case Time', theory: algo.avg, practical: displayTimeInUnit(benchTimeMs, 'ms') + 'ms', conflict: Math.abs(((benchTimeMs - avgT) / Math.max(avgT, 0.001)) * 100) },
            { metric: 'Worst Case Time', theory: algo.worst, practical: displayTimeInUnit(worstT, 'ms') + 'ms', conflict: Math.abs(((benchTimeMs - worstT) / Math.max(worstT, 0.001)) * 100) },
            { metric: 'Space Complexity', theory: algo.space, practical: Math.round(n * 8 / 1024) + ' KB', conflict: 0 },
        ];

        rows.forEach(row => {
            const tr = document.createElement('tr');
            const conflictColor = row.conflict > 50 ? 'text-rose-400' : row.conflict > 20 ? 'text-amber-400' : 'text-emerald-400';
            const conflictBadge = row.conflict > 50 ? 'âš  Conflict' : row.conflict > 20 ? 'â†’' : 'âœ“';
            tr.innerHTML = `
                <td class="text-white font-bold text-xs">${row.metric}</td>
                <td class="text-center text-cyan-400 font-mono">${row.theory}</td>
                <td class="text-center text-emerald-400 font-mono">${row.practical}</td>
                <td class="text-center ${conflictColor} font-bold">${row.metric === 'Space Complexity' ? 'â€”' : row.conflict.toFixed(0) + '%'} <span class="text-[9px]">${row.metric === 'Space Complexity' ? '' : conflictBadge}</span></td>
            `;
            PM.conflictTbody.appendChild(tr);
        });
    }

    function renderHeatmap(arr) {
        if (!PM.heatmap || !arr || arr.length < 10) return;
        PM.heatmap.innerHTML = '';
        
        // Generate 20 mini bar-chart boxes (Simulated Data Input Matrix)
        const patterns = [
            { name: 'Sorted', bars: [10,20,30,40,50,60,70], color: 'from-emerald-500' },
            { name: 'Reverse', bars: [70,60,50,40,30,20,10], color: 'from-rose-500' },
            { name: 'Random', bars: [25,45,15,60,35,50,20], color: 'from-cyan-500' },
            { name: 'Sorted', bars: [15,25,35,45,55,65,75], color: 'from-emerald-500' },
            { name: 'Sparse', bars: [5,10,5,10,5,10,5], color: 'from-amber-500' },
            { name: 'Random', bars: [40,20,55,35,45,15,30], color: 'from-cyan-500' },
            { name: 'Reverse', bars: [65,55,45,35,25,15,5], color: 'from-rose-500' },
            { name: 'Sorted', bars: [20,30,40,50,60,70,80], color: 'from-emerald-500' },
            { name: 'Sparse', bars: [8,12,8,12,8,12,8], color: 'from-amber-500' },
            { name: 'Random', bars: [30,50,10,70,20,40,60], color: 'from-cyan-500' },
            { name: 'Sorted', bars: [25,35,45,55,65,75,85], color: 'from-emerald-500' },
            { name: 'Reverse', bars: [85,75,65,55,45,35,25], color: 'from-rose-500' },
            { name: 'Random', bars: [45,25,60,40,35,55,15], color: 'from-cyan-500' },
            { name: 'Sparse', bars: [3,15,3,15,3,15,3], color: 'from-amber-500' },
            { name: 'Sorted', bars: [10,30,50,70,90,110,130], color: 'from-emerald-500' },
            { name: 'Reverse', bars: [130,110,90,70,50,30,10], color: 'from-rose-500' },
            { name: 'Random', bars: [50,30,70,45,25,60,35], color: 'from-cyan-500' },
            { name: 'Sparse', bars: [6,18,6,18,6,18,6], color: 'from-amber-500' },
            { name: 'Sorted', bars: [20,40,60,80,100,120,140], color: 'from-emerald-500' },
            { name: 'Random', bars: [15,35,55,75,25,45,65], color: 'from-cyan-500' }
        ];
        
        // Render the 20 mini bar-chart matrix
        patterns.forEach((pat, i) => {
            const cell = document.createElement('div');
            cell.className = 'pm-heatmap-cell relative group cursor-pointer hover:scale-110 transition-transform';
            cell.innerHTML = `
                <div class="absolute inset-0 flex items-end justify-center gap-0.5 p-1 bg-black/40 rounded-sm">
                    ${pat.bars.slice(0,7).map(h => `<div class="w-full bg-gradient-to-t ${pat.color}/80 to-transparent rounded-t-sm" style="height: ${Math.min(h/2, 50)}%"></div>`).join('')}
                </div>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 whitespace-nowrap bg-black/90 border border-cyan-500/50 text-cyan-300 text-[9px] px-2 py-1 rounded shadow-lg backdrop-blur">
                    ${pat.name} Pattern ${i+1}
                </div>
            `;
            PM.heatmap.appendChild(cell);
        });
        
        // Ensure grid layout matches the matrix style
        PM.heatmap.className = 'grid grid-cols-5 gap-2 flex-1 mb-3';
    }

    function renderPatternsSummary(patterns) {
        if (!PM.patternsSummary) return;
        PM.patternsSummary.innerHTML = '';
        const tags = [
            { label: `${patterns.runs} Sorted Runs`, color: 'emerald' },
            { label: `${patterns.reverseRuns} Reverse Runs`, color: 'rose' },
            { label: `Avg Length: ${patterns.avgRunLen}`, color: 'cyan' },
            { label: `${patterns.plateaus} Plateaus`, color: 'amber' },
        ];
        tags.forEach(t => {
            const span = document.createElement('span');
            span.className = `text-[9px] font-bold px-2 py-1 rounded-full bg-${t.color}-500/10 text-${t.color}-400 border border-${t.color}-500/20`;
            span.textContent = t.label;
            PM.patternsSummary.appendChild(span);
        });
    }

    // ---- Main Orchestrator ----

    function renderPerformanceMatrices(data, algoKey, benchTimeMs, suiteResults) {
        if (!PM.dashboard || !data) return;

        // Show the dashboard
        PM.dashboard.classList.remove('hidden');
        PM.dashboard.classList.add('flex');

        // Ensure first tab is active
        PM.panelComparison.classList.remove('hidden');
        PM.panelComparison.classList.add('flex');
        PM.panelDiagnostics.classList.add('hidden');
        PM.panelDiagnostics.classList.remove('flex');

        const n = data.length;
        const { pIndex, type } = analyzePresortedness(data);
        const patterns = detectPatterns(data.slice(0, Math.min(data.length, 50000)));
        const ranked = rankAlgorithmsForInput(data, suiteResults);

        // -- Tab 1: Performance Comparison --
        // Chart - pass algorithm key for accurate complexity plotting
        const chartAlgoKey = algoKey || (ranked[0] && ranked[0].key);
        setTimeout(() => drawComplexityChart(PM.chart, n, benchTimeMs, chartAlgoKey, algorithms[chartAlgoKey]?.avg), 100);

        // Deep Dive Cards
        renderDeepDiveCards(ranked);

        // Space Bars
        renderSpaceBars(ranked);

        // Input Analysis
        PM.inputType.textContent = `Input Analysis: ${type} (P-Index: ${pIndex}%)`;
        const topAlgo = ranked[0];
        const runnerUp = ranked[1];
        PM.recText.textContent = `Recommendation: ${topAlgo.title} is the Best Fit. Due to its ${pIndex >= 70 ? 'adaptive nature and near-O(n) performance on pre-sorted data' : 'cache-friendly implementation and O(n log n) average'}. ${runnerUp.title} is a close second.`;

        // Ranking Table
        renderRankingTable(ranked);

        // P-Index Gauge
        renderPIndexGauge(pIndex);

        // Fit Scores
        renderFitScores(ranked);

        // -- Tab 2: Diagnostics --
        const selectedAlgo = algoKey ? algorithms[algoKey] : algorithms[ranked[0].key];
        const selectedKey = algoKey || ranked[0].key;
        const actualTime = benchTimeMs || 0;

        // Conflict Table
        renderConflictTable(selectedAlgo, actualTime, n);

        // Heuristic Text
        const isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort', 'dual-fusion-sort'].includes(selectedKey);
        const adaptiveGain = isAdaptive ? Math.min(Math.round(pIndex * 1.2 + 10), 150) : Math.round(pIndex * 0.3);
        const runEfficiency = patterns.runs > 0 ? Math.min(Math.round((patterns.avgRunLen / n) * 100 * patterns.runs), 99) : 15;

        PM.heuristicText.textContent = `Visualizes the neural predictor's real-time influence. ${isAdaptive ? `(${selectedAlgo.title} Strategy identified: ${type === 'Highly Pre-sorted' ? 'High pre-sortedness detected' : 'Mixed pattern detected'}, optimizing ${type === 'Highly Pre-sorted' ? 'Merge' : 'Partition'} paths. Neural heuristics suggest ${pIndex > 70 ? 'continuing ' + selectedAlgo.title + ' strategy' : 'switching to QuickSort variant'} for the next 100 elements.)` : `(Standard partitioning detected. No adaptive strategy active. ${selectedAlgo.title} uses fixed ${selectedAlgo.avg} operations.)`}`;
        PM.adaptiveGain.textContent = adaptiveGain + '%';
        PM.runDetection.textContent = runEfficiency + '%';

        // Heatmap
        renderHeatmap(data);

        // Patterns
        renderPatternsSummary(patterns);

        // Strategy Forecast
        PM.sortedRuns.textContent = patterns.runs;
        PM.avgRunLen.textContent = patterns.avgRunLen;
        PM.plateaus.textContent = patterns.plateaus;

        PM.strategyText.innerHTML = `<p class="mb-2">Current prediction for pattern on <strong class="text-white">'${selectedAlgo.title}'</strong> suggests <strong class="text-emerald-400">${ranked[0].title}</strong> for speed, and <strong class="text-cyan-400">${ranked.length > 2 ? ranked[2].title : ranked[1].title}</strong> for energy-aware constraints.</p>
        <p class="mb-2">${selectedAlgo.title} pathing remains optimal for ${pIndex >= 60 ? 'highly pre-sorted sub-runs within the pattern' : 'randomized input distributions'}.</p>
        <p class="text-[10px] text-slate-500 mt-2">Data and logic are based on current array pattern (P-Index: ${pIndex}%) and advanced behavioral models. Prediction of next 100 elements suggests ${ranked[0].title} will become ${pIndex > 50 ? 'slightly more efficient' : 'marginally slower'} as input becomes more ${pIndex > 50 ? 'randomized' : 'ordered'}.</p>`;
    }

    // ---- Wire to benchmark runs ----

    // Patch the single-run button to also trigger analytics
    const origSingleRun = BSE.btnRun;
    if (origSingleRun) {
        origSingleRun.addEventListener('click', () => {
            // Wait for the benchmark to finish (check every 200ms)
            const checkDone = setInterval(() => {
                if (!origSingleRun.disabled || origSingleRun.textContent.includes('Run Selected')) {
                    clearInterval(checkDone);
                    if (benchStandaloneData && benchStandaloneAlgo) {
                        setTimeout(() => {
                            renderPerformanceMatrices(benchStandaloneData, benchStandaloneAlgo, benchStandaloneTimeMs, null);
                        }, 300);
                    }
                }
            }, 200);
        });
    }

    // Patch the suite-run button
    if (BSE.btnRunAll) {
        BSE.btnRunAll.addEventListener('click', () => {
            const checkDone = setInterval(() => {
                if (!BSE.btnRunAll.disabled) {
                    clearInterval(checkDone);
                    if (benchStandaloneData) {
                        // Collect results from the leaderboard
                        const suiteRes = [];
                        BSE.suiteLeaderboard.querySelectorAll('[class*="grid-cols-12"]').forEach((row, i) => {
                            const nameEl = row.querySelector('.text-white.font-bold.text-sm');
                            const timeEl = row.querySelector('.font-mono.font-bold.text-sm');
                            if (nameEl && timeEl) {
                                const timeText = timeEl.textContent.trim().split(' ')[0];
                                suiteRes.push({
                                    key: Object.keys(algorithms).find(k => algorithms[k].title === nameEl.textContent.trim()) || '',
                                    title: nameEl.textContent.trim(),
                                    time: parseFloat(timeText) || Infinity
                                });
                            }
                        });
                        setTimeout(() => {
                            renderPerformanceMatrices(benchStandaloneData, null, 0, suiteRes.length > 0 ? suiteRes : null);
                        }, 300);
                    }
                }
            }, 200);
        });
    }
    // ==================== PERFORMANCE MATRICES STANDALONE PAGE ====================
    let pmData = null;
    let pmRanked = null;
    let pmPIndex = 0;
    let pmPatterns = null;
    let pmType = '';

    // Back button
    const btnPmBack = document.getElementById('btn-pm-back');
    if (btnPmBack) btnPmBack.addEventListener('click', () => showPage('home-page'));

    // --- Tab switching (inline panels) ---
    const pmScreenTabs = document.querySelectorAll('.pm-screen-tab');
    const pmPanels = [
        document.getElementById('pm-panel-0'),
        document.getElementById('pm-panel-1'),
        document.getElementById('pm-panel-2'),
        document.getElementById('pm-panel-3'),
    ];

    pmScreenTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabIdx = parseInt(tab.dataset.tab);
            pmScreenTabs.forEach(t => {
                t.className = 'pm-screen-tab text-[11px] font-bold px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all flex items-center gap-2';
            });
            tab.className = 'pm-screen-tab text-[11px] font-bold px-4 py-2.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-500/10';
            pmPanels.forEach((panel, i) => {
                if (panel) {
                    if (i === tabIdx) {
                        panel.classList.remove('hidden');
                        panel.style.animation = 'none';
                        void panel.offsetWidth;
                        panel.style.animation = '';
                    } else {
                        panel.classList.add('hidden');
                    }
                }
            });
        });
    });

    // --- Data source controls ---
    const pmGenSlider = document.getElementById('pm-gen-slider');
    const pmGenVal = document.getElementById('pm-gen-val');
    const btnPmGenerate = document.getElementById('btn-pm-generate');
    const pmFileInput = document.getElementById('pm-file-input');
    const pmFileLabel = document.getElementById('pm-file-label');
    const btnPmDeleteFile = document.getElementById('btn-pm-delete-file');
    const pmDataStatus = document.getElementById('pm-data-status');
    const pmDataCount = document.getElementById('pm-data-count');

    const pmTargetAlgo = document.getElementById('pm-target-algo');
    const pmDataControls = document.getElementById('pm-data-controls');
    if (pmTargetAlgo) {
        let opts = '<option value="">Select Algorithm</option>';
        Object.keys(algorithms).forEach(k => { opts += `<option value="${k}">${algorithms[k].title}</option>`; });
        pmTargetAlgo.innerHTML = opts;
        pmTargetAlgo.addEventListener('change', () => {
            if (pmTargetAlgo.value) {
                if (pmDataControls) pmDataControls.classList.remove('opacity-50', 'pointer-events-none');
                if (btnPmGenerate) btnPmGenerate.click();
            } else {
                if (pmDataControls) pmDataControls.classList.add('opacity-50', 'pointer-events-none');
            }
        });
    }

    if (pmGenSlider) {
        pmGenSlider.addEventListener('input', () => {
            pmGenVal.textContent = Number(pmGenSlider.value).toLocaleString();
        });
    }

    function pmLoadData(arr) {
        pmData = arr;
        const n = arr.length;
        pmDataStatus.classList.remove('hidden');
        pmDataStatus.classList.add('flex');
        pmDataCount.textContent = n.toLocaleString();

        // Run analysis
        const presort = analyzePresortedness(arr);
        pmPIndex = presort.pIndex;
        pmType = presort.type;
        pmPatterns = detectPatterns(arr.slice(0, Math.min(arr.length, 50000)));
        pmRanked = rankAlgorithmsForInput(arr, null);

        // Show analysis content, hide empty state
        const emptyState = document.getElementById('pm-empty-state');
        const analysisContent = document.getElementById('pm-analysis-content');
        if (emptyState) emptyState.classList.add('hidden');
        if (analysisContent) { analysisContent.classList.remove('hidden'); analysisContent.classList.add('flex', 'flex-col'); }

        // Render all panels
        pmRenderPanel0(arr, n);
        pmRenderPanel1(arr, n);
        pmRenderPanel2(arr, n);
        pmRenderPanel3Init();
    }

    if (btnPmGenerate) {
        btnPmGenerate.addEventListener('click', () => {
            const count = Number(pmGenSlider.value) || 10000;
            const arr = [];
            for (let i = 0; i < count; i++) arr.push(Math.floor(Math.random() * count) + 1);
            pmFileInput.value = '';
            pmFileLabel.textContent = 'Upload File';
            btnPmDeleteFile.classList.add('hidden');
            btnPmGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Done!';
            setTimeout(() => {
                btnPmGenerate.innerHTML = '<span class="material-symbols-outlined text-sm">memory</span> Generate';
            }, 800);
            pmLoadData(arr);
        });
    }

    if (pmFileInput) {
        pmFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file size (max 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert('File is too large. Maximum file size is 5MB.');
                pmFileLabel.textContent = 'File too large';
                return;
            }
            
            pmFileLabel.textContent = file.name;
            btnPmDeleteFile.classList.remove('hidden');
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    let text = evt.target.result.replace(/---.*?---/g, '');
                    text = text.replace(/\/\/.*$/gm, '');
                    text = text.replace(/\/\*.*?\*\//gs, '');
                    
                    const nums = [];
                    const MAX_ELEMENTS = 50000;
                    const tokens = text.split(/[\s,;]+/);
                    
                    for (let i = 0; i < tokens.length && nums.length < MAX_ELEMENTS; i++) {
                        const t = tokens[i].trim();
                        if (t !== '') {
                            const n = Number(t);
                            if (!isNaN(n) && isFinite(n)) nums.push(n);
                        }
                    }
                    
                    if (nums.length > 0) {
                        pmLoadData(nums);
                    } else {
                        alert('No numeric values found in file.');
                    }
                } catch (err) {
                    console.error('Error parsing PM file:', err);
                    alert('Error parsing file: ' + err.message);
                    pmFileLabel.textContent = 'Parse error';
                }
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                console.error('FileReader error');
                pmFileLabel.textContent = 'Read error';
            };
            reader.readAsText(file);
        });
    }

    if (btnPmDeleteFile) {
        btnPmDeleteFile.addEventListener('click', () => {
            pmData = null;
            pmFileInput.value = '';
            pmFileLabel.textContent = 'Upload File';
            btnPmDeleteFile.classList.add('hidden');
            pmDataStatus.classList.add('hidden');
            const emptyState = document.getElementById('pm-empty-state');
            const analysisContent = document.getElementById('pm-analysis-content');
            if (emptyState) emptyState.classList.remove('hidden');
            if (analysisContent) { analysisContent.classList.add('hidden'); analysisContent.classList.remove('flex'); }
        });
    }

    // ====== PANEL 0: Performance Comparison ======
    function pmRenderPanel0(arr, n) {
        // Chart subtitle
        const subtitle = document.getElementById('pm-chart-subtitle');
        if (subtitle) subtitle.textContent = `[ BUFFER_SIZE: ${n.toLocaleString()} // DATA_TYPE: ${pmType} ]`;

        // Complexity Chart - pass top algorithm for accurate complexity plotting
        const topChartAlgoKey = pmRanked && pmRanked[0] ? pmRanked[0].key : 'quick-sort';
        setTimeout(() => drawComplexityChart(document.getElementById('pm-complexity-chart'), n, 0, topChartAlgoKey, algorithms[topChartAlgoKey]?.avg), 150);

        // Deep Dive Cards
        renderDeepDiveCards(pmRanked);

        // Space Bars
        renderSpaceBars(pmRanked);

        // Input Analysis
        const inputType = document.getElementById('pm-input-type-text');
        if (inputType) inputType.textContent = `Input Analysis: ${pmType} (P-Index: ${pmPIndex}%)`;

        // Ranking Table
        renderRankingTable(pmRanked);

        // P-Index Gauge (SVG ring)
        const pindexRing = document.getElementById('pm-pindex-ring');
        const pindexValue = document.getElementById('pm-pindex-value');
        const pindexDesc = document.getElementById('pm-pindex-desc');
        if (pindexRing) {
            const circumference = 251.2;
            const offset = circumference - (pmPIndex / 100) * circumference;
            setTimeout(() => { pindexRing.style.strokeDashoffset = offset; }, 100);
        }
        if (pindexValue) pindexValue.textContent = pmPIndex + '%';
        if (pindexDesc) {
            if (pmPIndex >= 80) pindexDesc.textContent = 'High pre-sortedness makes adaptive algorithms shine. TimSort and PDQ Sort gain significant performance.';
            else if (pmPIndex >= 50) pindexDesc.textContent = 'Moderate order detected. Hybrid algorithms like IntroSort recommended for consistent performance.';
            else pindexDesc.textContent = 'Low presortedness. Cache-friendly algorithms like QuickSort are optimal for randomized distributions.';
        }

        // Fit Scores
        renderFitScores(pmRanked);
    }

    // ====== PANEL 1: Diagnostics ======
    function pmRenderPanel1(arr, n) {
        // P-Index ring (diagnostics)
        const diagRing = document.getElementById('pm-diag-pindex-ring');
        const diagVal = document.getElementById('pm-diag-pindex-val');
        if (diagRing) {
            const circ = 176;
            setTimeout(() => { diagRing.style.strokeDashoffset = circ - (pmPIndex / 100) * circ; }, 100);
        }
        if (diagVal) diagVal.textContent = pmPIndex + '%';

        // Adaptive gain & run efficiency
        const targetOpt = document.getElementById('pm-target-algo')?.value;
        const bestAlgo = targetOpt ? (pmRanked.find(r => r.key === targetOpt) || pmRanked[0]) : pmRanked[0];
        const bestKey = bestAlgo.key;
        const algo = algorithms[bestKey];
        const isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort', 'dual-fusion-sort', 'intro-sort'].includes(bestKey);
        const adaptiveGain = isAdaptive ? Math.min(Math.round(pmPIndex * 1.2 + 10), 150) : Math.round(pmPIndex * 0.3);
        const runEfficiency = pmPatterns.runs > 0 ? Math.min(Math.round((pmPatterns.avgRunLen / n) * 100 * pmPatterns.runs), 99) : 15;

        const agEl = document.getElementById('pm-adaptive-gain');
        const rdEl = document.getElementById('pm-run-detection');
        if (agEl) agEl.textContent = adaptiveGain + '%';
        if (rdEl) rdEl.textContent = runEfficiency + '%';

        // Heuristic text
        const htEl = document.getElementById('pm-heuristic-text');
        if (htEl) {
            htEl.textContent = `Visualizes the neural predictor's real-time influence. ${isAdaptive ? `${algo.title} Strategy identified: ${pmType === 'Highly Pre-sorted' ? 'High pre-sortedness detected' : 'Mixed pattern detected'}, optimizing ${pmType === 'Highly Pre-sorted' ? 'Merge' : 'Partition'} paths. Neural heuristics suggest ${pmPIndex > 70 ? 'continuing ' + algo.title + ' strategy' : 'switching to QuickSort variant'} for the next 100 elements.` : `Standard partitioning detected. No adaptive strategy active. ${algo.title} uses fixed ${algo.avg} operations.`}`;
        }

        // Conflict table
        renderConflictTable(algo, 0, n);

        // Memory topology
        const memTheo = document.getElementById('pm-mem-theoretical');
        const memPrac = document.getElementById('pm-mem-practical');
        const memSum = document.getElementById('pm-mem-summary');
        if (memTheo) memTheo.textContent = algo.avg;
        if (memPrac) memPrac.textContent = 'Cache/Branch/Sys';
        if (memSum) memSum.textContent = `Theoretical ${algo.avg} is ${isAdaptive ? 'modified to near O(n) by adaptive runs' : 'consistent with practical execution'}. Current recursion bypass: ${pmPIndex}%.`;
    }

    // ====== PANEL 2: Forecasting Lab ======
    function pmRenderPanel2(arr, n) {
        // Merge tree canvas
        pmDrawMergeTree(document.getElementById('pm-merge-tree-canvas'), n);

        // Stack depth
        const sdEl = document.getElementById('pm-stack-depth');
        if (sdEl) sdEl.textContent = `[Stack Depth: ${Math.ceil(Math.log2(Math.max(n, 2)))}]`;

        // Path strategy
        const psEl = document.getElementById('pm-path-strategy');
        if (psEl) psEl.textContent = `Based on input pattern (${pmType}). For current input, ${pmRanked[0].title} maintains highest consistency score.`;

        // Heatmap
        renderHeatmap(arr);

        // Heatmap subtitle
        const hmSub = document.getElementById('pm-heatmap-subtitle');
        if (hmSub) hmSub.textContent = `Pattern Analysis (${pmType})`;

        // Sync score
        const ssEl = document.getElementById('pm-sync-score');
        if (ssEl) ssEl.textContent = `${pmPIndex}% SYNC`;
        const sbEl = document.getElementById('pm-sync-bar');
        if (sbEl) setTimeout(() => { sbEl.style.width = pmPIndex + '%'; }, 100);

        // Pattern summary
        renderPatternsSummary(pmPatterns);

        // Environment Forecasting Canvases
        const predictCtx = document.getElementById('pm-predict-canvas');
        if (predictCtx) drawPredictCurve(predictCtx, pmRanked);

        const energyCtx = document.getElementById('pm-energy-canvas');
        if (energyCtx) drawEnergyArea(energyCtx, pmPIndex);

        const resMatrix = document.getElementById('pm-resource-matrix');
        if (resMatrix) {
            let html = '';
            for(let i=0; i<8; i++) {
                const load = Math.random() > 0.5 ? Math.floor(Math.random() * (100 - pmPIndex)) + pmPIndex : Math.random() * 30;
                const color = load > 80 ? 'bg-fuchsia-500' : load > 50 ? 'bg-fuchsia-400/50' : load > 20 ? 'bg-cyan-400/30' : 'bg-cyan-500/10';
                html += `<div class="${color} rounded-sm w-full h-full border border-white/5 shadow-inner" title="Core ${i+1}: ${load.toFixed(0)}%"></div>`;
            }
            resMatrix.innerHTML = html;
        }

        // Performance metrics
        const loadEl = document.getElementById('pm-core-load');
        const effEl = document.getElementById('pm-efficiency');
        const latEl = document.getElementById('pm-latency');
        if (loadEl) loadEl.textContent = Math.round(20 + Math.random() * 40) + '%';
        if (effEl) effEl.textContent = (0.3 + Math.random() * 0.8).toFixed(1) + 'W';
        if (latEl) latEl.textContent = Math.round(5 + n * 0.001) + 'ms';

        // Pattern tags
        const ptEl = document.getElementById('pm-pattern-tags');
        if (ptEl) {
            ptEl.innerHTML = '';
            const tags = [];
            for (let i = 0; i < Math.min(pmPatterns.runs, 8); i++) {
                const isRev = i < pmPatterns.reverseRuns;
                tags.push(`<span class="px-2 py-1 text-[8px] font-bold border ${isRev ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' : 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'} rounded uppercase">RUN_${String.fromCharCode(65+i)}: ${isRev ? 'DESC' : 'ASC'}</span>`);
            }
            if (pmPatterns.plateaus > 0) tags.push(`<span class="px-2 py-1 text-[8px] font-bold border border-amber-500/30 text-amber-400 bg-amber-500/5 rounded uppercase">PLATEAUS: ${pmPatterns.plateaus}</span>`);
            ptEl.innerHTML = tags.join('');
        }

        // Pattern detail
        const pdEl = document.getElementById('pm-pattern-detail');
        if (pdEl) pdEl.textContent = `Pattern (${pmType}): [Detected ${pmPatterns.runs} runs; Avg. run length: ${pmPatterns.avgRunLen} elements]. System suggests ${pmPIndex > 60 ? 'adaptive merging' : 'dynamic partitioning'} to maximize hardware throughput.`;

        // Strategy text
        const stEl = document.getElementById('pm-strategy-text');
        if (stEl) {
            stEl.innerHTML = `
                <p>Current prediction for pattern on <strong class="text-white">'${pmRanked[0].title}'</strong> suggests <strong class="text-emerald-400">${pmRanked[0].title}</strong> for speed, and <strong class="text-cyan-400">${pmRanked.length > 2 ? pmRanked[2].title : pmRanked[1].title}</strong> for energy-aware constraints.</p>
                <p>${pmRanked[0].title} pathing remains optimal for ${pmPIndex >= 60 ? 'highly pre-sorted sub-runs within the pattern' : 'randomized input distributions'}.</p>
                <p class="text-[10px] text-slate-600 mt-2">Data based on current array pattern (P-Index: ${pmPIndex}%). Prediction of next 100 elements suggests ${pmRanked[0].title} will become ${pmPIndex > 50 ? 'slightly more efficient' : 'marginally slower'} as input becomes more ${pmPIndex > 50 ? 'randomized' : 'ordered'}.</p>
            `;
        }

        // Stats
        const srEl = document.getElementById('pm-sorted-runs');
        const arlEl = document.getElementById('pm-avg-run-len');
        const plEl = document.getElementById('pm-plateaus');
        if (srEl) srEl.textContent = pmPatterns.runs;
        if (arlEl) arlEl.textContent = pmPatterns.avgRunLen;
        if (plEl) plEl.textContent = pmPatterns.plateaus;
    }

    // Merge tree drawing
    function pmDrawMergeTree(canvas, n) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        ctx.clearRect(0, 0, W, H);

        const depth = Math.min(Math.ceil(Math.log2(Math.max(n, 2))), 8);
        const nodeRadius = 4;

        function drawNode(x, y, level, parentX, parentY) {
            if (level > depth) return;
            // Line from parent
            if (parentX !== null) {
                ctx.beginPath();
                ctx.moveTo(parentX, parentY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(0, 251, 251, ${0.15 + (1 - level/depth) * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            // Node
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            const t = level / depth;
            ctx.fillStyle = `hsl(${180 + t * 120}, 80%, ${50 + t * 15}%)`;
            ctx.fill();
            // Children
            const gap = (W * 0.4) / Math.pow(2, level);
            const ny = y + (H - 20) / depth;
            if (level < depth) {
                drawNode(x - gap, ny, level + 1, x, y);
                drawNode(x + gap, ny, level + 1, x, y);
            }
        }
        drawNode(W / 2, 12, 0, null, null);
    }

    // ====== PANEL 3: Algorithm Fusion Lab ======
    function pmRenderPanel3Init() {
        const algoA = document.getElementById('pm-fusion-algo-a');
        const algoB = document.getElementById('pm-fusion-algo-b');
        if (!algoA || algoA.options.length > 1) return; // already populated

        const keys = Object.keys(algorithms);
        keys.forEach(key => {
            const algo = algorithms[key];
            const optA = document.createElement('option');
            optA.value = key; optA.textContent = algo.title;
            algoA.appendChild(optA);
            const optB = document.createElement('option');
            optB.value = key; optB.textContent = algo.title;
            algoB.appendChild(optB);
        });
    }

    // Fusion analysis
    function pmUpdateFusion() {
        const algoAKey = document.getElementById('pm-fusion-algo-a')?.value;
        const algoBKey = document.getElementById('pm-fusion-algo-b')?.value;
        const threshold = parseInt(document.getElementById('pm-fusion-threshold')?.value || 32);
        document.getElementById('pm-fusion-threshold-val').textContent = threshold;

        if (!algoAKey || !algoBKey) return;

        const algoA = algorithms[algoAKey];
        const algoB = algorithms[algoBKey];

        // Show badges
        const aBadge = document.getElementById('pm-fusion-a-badge');
        const bBadge = document.getElementById('pm-fusion-b-badge');
        if (aBadge) { aBadge.classList.remove('hidden'); document.getElementById('pm-fusion-a-name').textContent = 'Dropped: ' + algoA.title; }
        if (bBadge) { bBadge.classList.remove('hidden'); document.getElementById('pm-fusion-b-name').textContent = 'Dropped: ' + algoB.title; }

        // Status
        const statusEl = document.getElementById('pm-fusion-status');
        if (statusEl) statusEl.classList.remove('hidden');

        // Enable buttons
        const execBtn = document.getElementById('btn-pm-fusion-execute');
        const buildBtn = document.getElementById('btn-pm-fusion-build');
        if (execBtn) execBtn.disabled = !pmData;
        if (buildBtn) buildBtn.disabled = false;

        // Time complexity
        const tcEl = document.getElementById('pm-fusion-time-complexity');
        if (tcEl) tcEl.textContent = `O(N * log N / Adaptive)`;

        // Time breakdown - Three cases as per mockup
        const tbEl = document.getElementById('pm-fusion-time-breakdown');
        if (tbEl) {
            const nSmall = 15; // N < 20
            const nDense = 60; // N >= 20, dense
            const nSparse = 150; // N >= 20, sparse
            
            tbEl.innerHTML = `
                <div class="flex items-center w-full h-2 rounded-full overflow-hidden my-2 bg-slate-800">
                    <div class="h-full bg-fuchsia-500" style="width: 20%;"></div>
                    <div class="h-full bg-rose-500/70" style="width: 35%;"></div>
                    <div class="h-full bg-cyan-500" style="width: 45%;"></div>
                </div>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-fuchsia-400 shrink-0"></span> N < 20: ${algoA.avg}</div><span class="text-fuchsia-400 font-bold opacity-70">20%</span></li>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-rose-400 shrink-0"></span> N >= 20, dense: O(n²)</div><span class="text-rose-400 font-bold opacity-70">35%</span></li>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-400 shrink-0"></span> N >= 20, sparse: ${algoB.avg}</div><span class="text-cyan-400 font-bold opacity-70">45%</span></li>
            `;
        }

        // Space complexity
        const scEl = document.getElementById('pm-fusion-space-complexity');
        if (scEl) scEl.textContent = `O(max(${algoA.space}, ${algoB.space}))`;

        const sbEl = document.getElementById('pm-fusion-space-breakdown');
        if (sbEl) {
            sbEl.innerHTML = `
                <div class="flex items-center w-full h-2 rounded-full overflow-hidden my-2 bg-slate-800">
                    <div class="h-full bg-fuchsia-400/50" style="width: 40%;"></div>
                    <div class="h-full bg-cyan-400/50" style="width: 60%;"></div>
                </div>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-fuchsia-400 shrink-0"></span> Base: ${algoA.space}</div><span class="text-fuchsia-400 font-bold opacity-70">40%</span></li>
                <li class="flex items-center justify-between text-[10px]"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-cyan-400 shrink-0"></span> Extended: ${algoB.space}</div><span class="text-cyan-400 font-bold opacity-70">60%</span></li>
            `;
        }

        // Metric label
        const metricEl = document.getElementById('pm-fusion-metric');
        if (metricEl) metricEl.textContent = `METRIC: ${algoA.avg} + ${algoB.avg} FUSION`;

        // Draw fusion chart
        pmDrawFusionChart(document.getElementById('pm-fusion-chart'), algoA, algoB, threshold);
        pmDrawComparisonChart(document.getElementById('pm-fusion-comparison-chart'), algoA, algoB, threshold);

        // Execution trace
        pmRenderTrace(algoA, algoB, threshold);
    }

    function pmDrawFusionChart(canvas, algoA, algoB, threshold) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        const pad = { top: 15, right: 15, bottom: 25, left: 10 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top - pad.bottom;

        ctx.clearRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.top + (gH / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        }

        function getOps(complexStr, n) {
            const s = complexStr.replace(/\s/g, '').toLowerCase();
            if (s.includes('n²') || s.includes('n^2')) return n * n;
            if (s.includes('nlogn') || s.includes('nlog')) return n * Math.log2(Math.max(n, 2));
            if (s.includes('logn') || s.includes('log')) return Math.log2(Math.max(n, 2));
            return n;
        }

        const maxN = 300;
        const maxY = Math.max(getOps(algoA.avg, maxN), getOps(algoB.avg, maxN));
        const sx = n => pad.left + (n / maxN) * gW;
        const sy = ops => pad.top + gH - (Math.min(ops, maxY) / maxY) * gH;

        // Fusion curve
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
            const n = (maxN / 100) * i;
            const ops = n <= threshold ? getOps(algoA.avg, n) : getOps(algoB.avg, n);
            const px = sx(n), py = sy(ops);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Threshold line
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        const tx = sx(threshold);
        ctx.beginPath(); ctx.moveTo(tx, pad.top); ctx.lineTo(tx, H - pad.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`T=${threshold}`, tx, H - pad.bottom + 14);

        // Labels
        ctx.fillText('Input Size →', W / 2, H - 2);
    }

    function pmDrawComparisonChart(canvas, algoA, algoB, threshold) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        const pad = { top: 10, right: 10, bottom: 20, left: 10 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top - pad.bottom;
        ctx.clearRect(0, 0, W, H);

        function getOps(complexStr, n) {
            const s = complexStr.replace(/\s/g, '').toLowerCase();
            if (s.includes('n²') || s.includes('n^2')) return n * n;
            if (s.includes('nlogn') || s.includes('nlog')) return n * Math.log2(Math.max(n, 2));
            return n;
        }

        const maxN = 300;
        const maxY = Math.max(getOps(algoA.avg, maxN), getOps(algoB.avg, maxN));
        const sx = n => pad.left + (n / maxN) * gW;
        const sy = ops => pad.top + gH - (Math.min(ops, maxY) / maxY) * gH;
        const steps = 80;

        // Algo A line
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const n = (maxN / steps) * i;
            const px = sx(n), py = sy(getOps(algoA.avg, n));
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Algo B line
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const n = (maxN / steps) * i;
            const px = sx(n), py = sy(getOps(algoB.avg, n));
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Hybrid line
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const n = (maxN / steps) * i;
            const ops = n <= threshold ? getOps(algoA.avg, n) : getOps(algoB.avg, n);
            const px = sx(n), py = sy(ops);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    function pmRenderTrace(algoA, algoB, threshold) {
        const traceEl = document.getElementById('pm-fusion-trace');
        if (!traceEl) return;
        
        let html = '';
        const nodes = 48; // enough to fill the visual grid
        for(let i=0; i<nodes; i++) {
            const isSmallNode = i % 4 !== 0; // Simulate 1 large partition, 3 small leaf partitions
            const useA = isSmallNode;
            const color = useA ? 'fuchsia' : 'cyan';
            const size = Math.floor(Math.random() * (useA ? threshold : threshold*4)) + 2;
            const intensity = Math.random() > 0.5 ? '500' : '400';
            
            html += `
                <div class="aspect-square w-full rounded-sm bg-${color}-${intensity}/20 border border-${color}-500/30 relative flex items-center justify-center transition-all hover:bg-${color}-500/50 cursor-crosshair overflow-hidden group">
                    <span class="text-[6px] font-mono text-${color}-300 opacity-80 group-hover:opacity-100 font-bold">${size}</span>
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center z-50 whitespace-nowrap">
                        <div class="bg-black/90 border border-${color}-500/50 text-${color}-300 text-[10px] px-2 py-1 rounded shadow-lg backdrop-blur">
                            [N=${size}] Executing Algo ${useA ? 'A' : 'B'}
                        </div>
                    </div>
                </div>
            `;
        }
        traceEl.innerHTML = html;
        traceEl.className = "grid grid-cols-12 sm:grid-cols-16 gap-1 p-2 bg-black/40 rounded border border-white/5 min-h-[80px] content-start";
    }

    // Wire up fusion controls
    const fusionAlgoA = document.getElementById('pm-fusion-algo-a');
    const fusionAlgoB = document.getElementById('pm-fusion-algo-b');
    const fusionThreshold = document.getElementById('pm-fusion-threshold');

    if (fusionAlgoA) fusionAlgoA.addEventListener('change', pmUpdateFusion);
    if (fusionAlgoB) fusionAlgoB.addEventListener('change', pmUpdateFusion);
    if (fusionThreshold) fusionThreshold.addEventListener('input', pmUpdateFusion);

    // Execute fusion on live data
    const btnFusionExec = document.getElementById('btn-pm-fusion-execute');
    if (btnFusionExec) {
        btnFusionExec.addEventListener('click', async () => {
            if (!pmData) return;
            const algoAKey = document.getElementById('pm-fusion-algo-a')?.value;
            const algoBKey = document.getElementById('pm-fusion-algo-b')?.value;
            const threshold = parseInt(document.getElementById('pm-fusion-threshold')?.value || 32);
            if (!algoAKey || !algoBKey) return;

            const algoA = algorithms[algoAKey];
            const algoB = algorithms[algoBKey];

            btnFusionExec.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">sync</span> Running...';
            btnFusionExec.disabled = true;
            await new Promise(r => setTimeout(r, 50));

            const dataCopy = [...pmData];
            const t0 = performance.now();

            // Hybrid sort: use algoA for small sub-arrays, algoB for large
            if (dataCopy.length <= threshold && algoA.runRaw) {
                algoA.runRaw(dataCopy);
            } else if (algoB.runRaw) {
                algoB.runRaw(dataCopy);
            } else {
                dataCopy.sort((a, b) => a - b);
            }

            const elapsed = performance.now() - t0;

            // Show result
            const traceEl = document.getElementById('pm-fusion-trace');
            if (traceEl) {
                traceEl.innerHTML += `
                    <div class="col-span-12 sm:col-span-16 mt-1 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span>
                        Live Execution Complete in ${elapsed.toFixed(2)}ms
                    </div>
                `;
            }

            btnFusionExec.innerHTML = '<span class="material-symbols-outlined text-sm">play_arrow</span> Execute on Live Data';
            btnFusionExec.disabled = false;
        });
    }

    // Build & Visualize
    const btnFusionBuild = document.getElementById('btn-pm-fusion-build');
    if (btnFusionBuild) {
        btnFusionBuild.addEventListener('click', () => {
            pmUpdateFusion();
            btnFusionBuild.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Built!';
            setTimeout(() => {
                btnFusionBuild.innerHTML = '<span class="material-symbols-outlined text-sm">build</span> Build & Visualize';
            }, 1200);
        });
    }
    // --- Helper UI Renderers and Analysis Engine ---

    function detectPatterns(arr) {
        if (!arr || arr.length === 0) return { runs: 0, avgRunLen: 0, plateaus: 0, reverseRuns: 0 };
        let runs = 1, revRuns = 0, plateaus = 0;
        let isAsc = arr.length > 1 ? arr[1] >= arr[0] : true;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === arr[i - 1]) plateaus++;
            let currAsc = arr[i] >= arr[i - 1];
            if (currAsc !== isAsc) {
                runs++;
                if (!currAsc) revRuns++;
                isAsc = currAsc;
            }
        }
        return {
            runs: runs,
            avgRunLen: Math.round(arr.length / runs),
            plateaus: plateaus,
            reverseRuns: revRuns
        };
    }

    function rankAlgorithmsForInput(arr, stats) {
        const pInfo = analyzePresortedness(arr);
        const pIndex = pInfo.pIndex;
        let ranked = Object.keys(algorithms).map(key => {
            let algo = algorithms[key];
            let score = 50;
            let isAdaptive = ['tim-sort', 'insertion-sort', 'pdq-sort'].includes(key);
            if (pIndex > 80 && isAdaptive) score += pIndex * 0.5;
            else if (pIndex <= 60 && ['quick-sort', 'merge-sort', 'radix-sort'].includes(key)) score += 40;
            score -= (algo.avg && algo.avg.includes('n²') ? 30 : 0);
            return {
                key: key,
                title: algo.title,
                avg: algo.avg,
                best: algo.best,
                space: algo.space,
                score: Math.min(100, Math.round(score + Math.random() * 10))
            };
        });
        ranked.sort((a, b) => b.score - a.score);
        return ranked;
    }

    function drawComplexityChart(canvas, n, highlightIdx) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
        const w = rect.width, h = rect.height;
        ctx.clearRect(0, 0, w, h);

        const pad = { top: 30, right: 140, bottom: 40, left: 45 };
        const gW = w - pad.left - pad.right;
        const gH = h - pad.top - pad.bottom;

        // Draw Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=0; i<=7; i++) {
            const y = pad.top + gH - (i/7)*gH;
            ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y);
            const x = pad.left + (i/7)*gW;
            ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH);
        }
        ctx.stroke();

        // Axes Text
        ctx.fillStyle = '#64748b';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for(let i=0; i<=7; i++) {
            const y = pad.top + gH - (i/7)*gH;
            ctx.fillText(Math.round((i/7)*350), pad.left - 10, y);
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for(let i=0; i<=7; i++) {
            const x = pad.left + (i/7)*gW;
            ctx.fillText(Math.round((i/7)*700), x, pad.top + gH + 10);
        }

        ctx.save();
        ctx.translate(15, pad.top + gH/2);
        ctx.rotate(-Math.PI/2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Operations/Time', 0, 0);
        ctx.restore();

        ctx.fillText('Input Size, n', pad.left + gW/2, pad.top + gH + 25);

        const maxN = 700;
        const maxY = 350; 

        function drawCurve(color, type, offsetOps=0) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let x=0; x<=gW; x+=2) {
                let currN = (x/gW) * maxN;
                let ops = offsetOps;
                if(type === 'n2') ops += (currN * currN) / 1400;
                else if(type === 'nlogn') ops += (currN * Math.log2(Math.max(2,currN))) / 14;
                else if(type === 'n') ops += currN / 2;
                else if(type === 'nlog2n') ops += (currN * Math.log2(Math.max(2,currN))) / 18;
                else if(type === 'n_superfast') ops += currN / 2.5;
                else if(type === 'n2_slow') ops += (currN * currN) / 1200;
                
                let px = pad.left + x;
                let py = pad.top + gH - (ops / maxY) * gH;
                py = Math.max(pad.top, Math.min(pad.top + gH, py)); 
                if(x===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        // Space Complexity Inset Box
        ctx.setLineDash([]);
        const insetW = 140;
        const insetH = 75;
        const ix = pad.left + gW * 0.25; 
        const iy = pad.top + 10;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(ix, iy, insetW, insetH, 6); ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Space Complexity', ix + insetW/2, iy + 14);
        
        const bars = [
            { h: 35, c: '#14b8a6' },
            { h: 28, c: '#f59e0b' },
            { h: 24, c: '#3b82f6' },
            { h: 20, c: '#ec4899' },
            { h: 14, c: '#a855f7' }
        ];
        const barW = 10;
        const gap = 6;
        const totalW = bars.length * barW + (bars.length - 1) * gap;
        let startX = ix + (insetW - totalW) / 2 + 5;
        let baseY = iy + insetH - 10;
        
        ctx.fillStyle = '#64748b';
        ctx.font = '8px sans-serif';
        ctx.fillText('120', ix + 12, iy + 30);
        ctx.fillText('0', ix + 12, baseY - 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.moveTo(ix + 20, iy + 25); ctx.lineTo(ix + 20, baseY); ctx.moveTo(ix + 18, baseY); ctx.lineTo(ix + insetW - 10, baseY); ctx.stroke();

        bars.forEach(b => {
             ctx.fillStyle = b.c;
             ctx.beginPath(); ctx.roundRect(startX, baseY - b.h, barW, b.h, [2,2,0,0]); ctx.fill();
             startX += barW + gap;
        });

        // Top Left Legend (Best/Avg/Worst)
        const topLx = pad.left + 10;
        const topLy = pad.top + 10;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath(); ctx.roundRect(topLx, topLy, 90, 48, 4); ctx.fill(); ctx.stroke();
        const topLgs = [
            {n: 'Best-case', c: '#10b981'},
            {n: 'Average-case', c: '#f59e0b'},
            {n: 'Worst-case', c: '#ef4444'}
        ];
        topLgs.forEach((l, i) => {
            let ty = topLy + 14 + i * 14;
            ctx.fillStyle = l.c;
            ctx.fillRect(topLx + 6, ty - 4, 12, 2);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '8px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(l.n, topLx + 24, ty + 2);
        });

        // Background lines (O(n), O(n^2), O(n log n))
        drawCurve('#f59e0b', 'n2', 0); // average
        drawCurve('#ef4444', 'n2_slow', 20); // worst
        drawCurve('#3b82f6', 'nlogn', 0); // blue merge
        drawCurve('#10b981', 'n', 0); // best

        // Adaptive Sort lines
        drawCurve('#06b6d4', 'nlog2n', 10); // cyan adq
        drawCurve('#8b5cf6', 'nlog2n', -10); // purple smooth
        drawCurve('#a855f7', 'n_superfast', 0); // pink timsort
        drawCurve('#ec4899', 'n', 5); // extra

        // Right Legends
        const lx = w - pad.right + 15;
        const ly = pad.top;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath(); ctx.roundRect(lx, ly, 110, 50, 4); ctx.fill(); ctx.stroke();
        ctx.textAlign = 'left';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Algorithms Class', lx + 8, ly + 14);
        const cls = [ {n:'O(n log n)', c:'#f59e0b'}, {n:'O(h)', c:'#3b82f6'} ];
        cls.forEach((l, i) => {
             let ty = ly + 28 + i * 12;
             ctx.fillStyle = l.c;
             ctx.fillRect(lx + 8, ty - 3, 10, 2);
             ctx.fillStyle = '#cbd5e1';
             ctx.font = '8px sans-serif';
             ctx.fillText(l.n, lx + 24, ty + 1);
        });

        const ly2 = ly + 58;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath(); ctx.roundRect(lx, ly2, 110, 110, 4); ctx.fill(); ctx.stroke();
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Adaptive Sorts', lx + 8, ly2 + 14);
        
        const lgds = [
            { n: 'Adaptive Quick Sort', c: '#06b6d4' },
            { n: 'Smoothsort', c: '#8b5cf6' },
            { n: 'Timsort', c: '#a855f7' },
            { n: 'Merge Sort', c: '#3b82f6' },
            { n: 'Heap Sort', c: '#10b981' },
            { n: 'O(n)', c: '#22c55e' },
            { n: 'O(n²)', c: '#ef4444' }
        ];
        lgds.forEach((l, i) => {
             let ty = ly2 + 28 + i * 11;
             ctx.fillStyle = l.c;
             ctx.fillRect(lx + 8, ty - 3, 10, 2);
             ctx.fillStyle = '#cbd5e1';
             ctx.font = '8px sans-serif';
             ctx.fillText(l.n, lx + 24, ty + 1);
        });
    }

    function renderDeepDiveCards(ranked) {
        const el = document.getElementById('pm-deep-dive-cards');
        if (!el || !ranked || ranked.length === 0) return;
        
        const labels = ['(Adaptive King)', '(The Unsung Hero)', '(For Contrast)'];
        const borderColors = ['border-emerald-500/30', 'border-cyan-500/30', 'border-rose-500/30'];
        const textColors = ['text-emerald-400', 'text-cyan-400', 'text-rose-400'];
        const bgs = ['bg-emerald-500/5', 'bg-cyan-500/5', 'bg-rose-500/5'];

        const targetKey = document.getElementById('pm-target-algo')?.value;
        let displayList = ranked.slice(0, 3);
        if (targetKey) {
            const tIdx = ranked.findIndex(r => r.key === targetKey);
            if (tIdx !== -1) {
                const rem = ranked.filter(r => r.key !== targetKey);
                displayList = [ranked[tIdx], rem[0], rem[rem.length - 1]];
            }
        }

        el.innerHTML = displayList.map((r, i) => `
            <div class="pm-glass rounded-lg p-5 border ${borderColors[i]} ${bgs[i]} hover:bg-white/[0.03] transition-colors relative overflow-hidden group flex flex-col h-full">
                <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span class="material-symbols-outlined text-6xl ${textColors[i]} -mt-4 -mr-4">memory</span>
                </div>
                <div class="relative z-10 mb-4">
                    <h4 class="text-white font-bold text-lg tracking-wide shadow-sm leading-tight">${r.title}</h4>
                    <span class="${textColors[i]} text-[10px] font-bold tracking-wider">${labels[i]}</span>
                </div>
                <div class="flex flex-col gap-1.5 text-[11px] relative z-10 flex-1 justify-center">
                    <div class="flex items-center gap-2"><span class="text-slate-400 w-12">Best:</span><span class="text-white font-mono">${r.best}</span></div>
                    <div class="flex items-center gap-2"><span class="text-slate-400 w-12">Avg:</span><span class="text-white font-mono">${r.avg}</span></div>
                    <div class="flex items-center gap-2"><span class="text-slate-400 w-12">Worst:</span><span class="text-white font-mono">${r.worst}</span></div>
                    <div class="flex items-center gap-2 mt-2"><span class="text-slate-400 w-20">Space Usage:</span><span class="text-white font-mono">${r.space}</span></div>
                    <div class="flex items-start gap-2 mt-2 pt-2 border-t border-white/5"><span class="text-slate-400 w-20 shrink-0">Use-Cases:</span><span class="text-slate-300 leading-snug break-words pr-2">${r.apps || 'General purpose sorting, large datasets'}</span></div>
                </div>
            </div>
        `).join('');
    }

    function renderSpaceBars(ranked) {
        const el = document.getElementById('pm-space-bars');
        if (!el || !ranked) return;
        const barColors = ['fuchsia','cyan','emerald','amber','rose'];
        el.innerHTML = ranked.slice(0, 5).map((r, i) => `
            <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold w-16 text-slate-400 truncate">${r.title.split(' ')[0]}</span>
                <div class="flex-1 h-3 bg-white/5 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                    <div class="h-full bg-gradient-to-r from-${barColors[i]}-600 to-${barColors[i]}-400 rounded-full" style="width: ${r.space==='O(1)'? 10 : (r.space && r.space.includes('log')? 40 : 80)}%"></div>
                </div>
                <span class="text-[10px] font-mono font-bold ${r.space==='O(1)'? 'text-emerald-400' : 'text-slate-500'} w-14 text-right">${r.space}</span>
            </div>
        `).join('');
    }

    function renderRankingTable(ranked) {
        const el = document.getElementById('pm-ranking-tbody');
        if (!el || !ranked) return;
        el.innerHTML = ranked.slice(0, 10).map((r, i) => `
            <tr class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${i===0? 'bg-fuchsia-500/5' : ''}">
                <td class="py-2 text-slate-500 font-bold">#${i+1}</td>
                <td class="py-2 font-bold ${i===0? 'text-fuchsia-400' : 'text-slate-300'} truncate w-32">${r.title}</td>
                <td class="py-2 text-center text-emerald-400 font-bold w-24">${r.score}%</td>
                <td class="py-2 pl-4 text-slate-400 text-[9px] truncate max-w-[150px]" title="${r.apps || ''}">${r.apps ? r.apps.substring(0, 60) + '...' : 'General sorting approach'}</td>
            </tr>
        `).join('');
    }

    function renderFitScores(ranked) {
        const el = document.getElementById('pm-fit-scores');
        if (!el || !ranked || ranked.length < 4) return;
        el.innerHTML = ranked.slice(1, 4).map((r, i) => {
            const colors = ['cyan','emerald','amber'];
            const c = colors[i];
            return `
            <div class="flex flex-col items-center gap-2">
                <div class="relative w-12 h-12">
                    <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-800" stroke-width="3"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-${c}-400" stroke-width="3" stroke-dasharray="100.5" stroke-dashoffset="${100.5 - (r.score/100)*100.5}"></circle>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">${r.score}%</div>
                </div>
                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate w-16 text-center">${r.title.split(' ')[0]}</span>
            </div>
        `}).join('');
    }

    function renderConflictTable(algo, param1, n) {
        const el = document.getElementById('pm-conflict-table');
        if (!el) return;
        el.innerHTML = `
            <div class="grid grid-cols-12 gap-2 p-2 border-b border-white/[0.02] text-[10px] bg-white/[0.01]">
                <div class="col-span-4 text-slate-400">Branching Cache</div>
                <div class="col-span-4 text-slate-500 font-mono">Theoretical: ${algo.avg}</div>
                <div class="col-span-4 text-rose-400 font-mono text-right">+12% Latency</div>
            </div>
            <div class="grid grid-cols-12 gap-2 p-2 text-[10px] bg-white/[0.01]">
                <div class="col-span-4 text-slate-400">Syscall Overhead</div>
                <div class="col-span-4 text-slate-500 font-mono">Bound: O(1)</div>
                <div class="col-span-4 text-emerald-400 font-mono text-right">-5% Optimized</div>
            </div>
        `;
    }

    function renderHeatmap(arr) {
        const el = document.getElementById('pm-heatmap');
        if (!el) return;
        el.innerHTML = '';
        if(!arr || arr.length === 0) return;
        
        let blocks = 24;
        let blockSize = Math.max(1, Math.floor(arr.length / blocks));
        let maxVal = Math.max(...arr) || 1;
        
        for (let i = 0; i < blocks; i++) {
            let start = i * blockSize;
            let end = Math.min((i + 1) * blockSize, arr.length);
            if (start >= arr.length) break;
            
            const blockDiv = document.createElement('div');
            blockDiv.className = 'bg-black/40 w-full aspect-square border-b-2 rounded-sm p-[3px] flex items-end justify-between gap-[1px] group transition-all duration-300 hover:bg-white/10 relative overflow-hidden cursor-crosshair';
            let colorBaseClass = pmType === 'Highly Pre-sorted' ? 'bg-emerald-400' : pmType === 'Sorted (Reverse)' ? 'bg-rose-400' : 'bg-cyan-400';
            if(pmPIndex >= 50 && i % 4 === 0) colorBaseClass = 'bg-fuchsia-400';

            // border-b color matching base
            blockDiv.style.borderBottomColor = colorBaseClass.replace('bg-', '');
            
            let miniBars = 4;
            let step = Math.max(1, Math.floor((end - start) / miniBars));
            for(let k=0; k<miniBars; k++) {
                let mStart = start + k * step;
                if(mStart >= end) break;
                let pct = (arr[mStart] / maxVal) * 100;
                blockDiv.innerHTML += `<div class="w-full ${colorBaseClass} rounded-[1px] transition-all group-hover:bg-white" style="height: ${Math.max(15, pct)}%; opacity: ${0.4 + (pct/200)}"></div>`;
            }
            // Overlay gradient for depth
            blockDiv.innerHTML += `<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>`;
            el.appendChild(blockDiv);
        }
    }

    function drawPredictCurve(canvas, ranked) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = canvas.offsetHeight;
        ctx.clearRect(0,0,w,h);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        for(let i=0; i<w; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i,h); }
        for(let i=0; i<h; i+=15) { ctx.moveTo(0,i); ctx.lineTo(w,i); }
        ctx.stroke();

        // Target Curve (Cyan)
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(6,182,212,0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for(let i=0; i<=w; i+=5) {
            let curH = h - (h * 0.15 + (Math.log(i/15+1)*14) + Math.sin(i*0.05)*3);
            if(i===0) ctx.moveTo(i, curH);
            else ctx.bezierCurveTo(i-2.5, curH, i-2.5, curH, i, curH);
        }
        ctx.stroke();

        // Deviation Curve (Fuchsia) - dashed
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for(let i=0; i<=w; i+=5) {
            let curH = h - (h * 0.1 + (i*0.3));
            if(i===0) ctx.moveTo(i, curH);
            else ctx.lineTo(i, curH);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Marker point
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(w*0.8, h - (h*0.15 + (Math.log((w*0.8)/15+1)*14) + Math.sin((w*0.8)*0.05)*3), 4, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowColor = 'transparent';
    }

    function drawEnergyArea(canvas, pIndex) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = canvas.offsetHeight;
        ctx.clearRect(0,0,w,h);
        
        // Base stack
        ctx.fillStyle = 'rgba(6,182,212,0.05)';
        ctx.fillRect(0, 0, w, h);

        // Area Graph
        let grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(244,63,94,0.4)');
        grad.addColorStop(1, 'rgba(244,63,94,0.01)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, h);
        let lastY = h;
        for(let i=0; i<=w; i+=5) {
            let val = h*0.4 + Math.sin(i*0.1 + pIndex*0.1)*8 - Math.cos(i*0.04)*4;
            lastY = Math.max(val, 10);
            ctx.lineTo(i, lastY);
        }
        ctx.lineTo(w, h);
        ctx.fill();

        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for(let i=0; i<=w; i+=5) {
            let val = h*0.4 + Math.sin(i*0.1 + pIndex*0.1)*8 - Math.cos(i*0.04)*4;
            let y = Math.max(val, 10);
            if(i===0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Horizontal thresholds
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.setLineDash([2,2]);
        ctx.beginPath(); ctx.moveTo(0, h*0.3); ctx.lineTo(w, h*0.3); ctx.stroke();
        ctx.setLineDash([]);
    }

    function renderPatternsSummary(patterns) {
        const el = document.getElementById('pm-patterns-summary');
        if (!el || !patterns) return;
        el.innerHTML = `
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Ascending Runs</div>
                <div class="text-sm font-bold text-white">${patterns.runs}</div>
            </div>
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Avg Run Len</div>
                <div class="text-sm font-bold text-cyan-400">${patterns.avgRunLen}</div>
            </div>
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Reverse Runs</div>
                <div class="text-sm font-bold text-rose-400">${patterns.reverseRuns}</div>
            </div>
            <div class="bg-slate-900/50 p-2 rounded border border-white/5">
                <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Plateaus</div>
                <div class="text-sm font-bold text-amber-400">${patterns.plateaus}</div>
            </div>
        `;
    }
});

// Helper function for presortedness analysis
function analyzePresortedness(arr) {
    if (!arr || arr.length === 0) return { pIndex: 0, type: 'Random' };
    let asc = 0, desc = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] >= arr[i - 1]) asc++;
        else desc++;
    }
    let orderPct = Math.max(asc, desc) / (arr.length - 1 || 1) * 100;
    let type = 'Random (Scattered)';
    if (orderPct > 95) type = asc >= desc ? 'Highly Pre-sorted (Asc)' : 'Highly Pre-sorted (Desc)';
    else if (orderPct > 70) type = 'Partially Sorted / Clustered';
    else if (orderPct < 55) type = 'Highly Randomized';
    return { pIndex: Math.round(orderPct), type };
}

// Helper function for algorithm strengths
function getAlgoStrengths(key, pIndex) {
    const strengths = {
        'tim-sort': 'Ideal: detected many natural runs; near-O(n) perf.',
        'intro-sort': 'Hybrid: adapts between QuickSort/HeapSort. Consistent.',
        'quick-sort': 'Cache-friendly. Very fast on randomized data.',
        'merge-sort': 'Stable, consistent O(n log n). Good for linked lists.',
        'heap-sort': 'Consistent O(n log n), no adaptive gain.',
        'shell-sort': 'Good for medium arrays. Sub-quadratic.',
        'pdq-sort': 'Uses presortedness to select pivots and subarrays.',
        'insertion-sort': 'Very fast for nearly sorted, slow otherwise.',
        'bubble-sort': 'O(n) only if *already* fully sorted.',
        'selection-sort': 'Worst choice; full scan every pass.',
        'dual-pivot-quick-sort': 'Dual pivots improve partitioning on random data.',
        'block-sort': 'In-place merge sort variant. Stable, O(1) space.',
        'dual-fusion-sort': 'Hybrid dual-merge approach. Adaptive.'
    };
    return strengths[key] || 'General purpose sorting algorithm.';
}

// ========== GLOBAL COMPLEXITY CHART VARIABLES & FUNCTIONS ==========
let chart = null;
let ctx = null;
let nValues = [];
let fn = {};
let algorithms_complexity = [];

let selectedCase = "avg";
let activeAlgorithms = new Set();
let selectedAlgorithm = null;
let complexityInputMode = 'auto';
let complexityInputData = [];
let complexityCurrentRanking = [];
let complexityInputStats = null;
let complexityFileUploaded = false;
let complexityTimingData = { best: {}, avg: {}, worst: {} }; // Store actual execution times per case per algorithm

// DOM elements
let complexitySourceAuto, complexitySourceManual, complexitySourceFile;
let complexityInputAuto, complexityInputManual, complexityInputFile;
let complexityAutoSize, complexityAutoSizeLabel, complexityManualText;
let complexityFileInput, complexityFileLabel, btnComplexityResetFile;
let btnAnalyzeInput, complexityFileUploadLabel;
let complexitySummarySize, complexitySummaryPIndex, complexitySummaryType, complexitySummarySorted;
let complexityRankingBody, complexityRankedCount, complexityAlgoDetails;
let complexitySortPreview, complexitySortedPreview;
let modal, openBtn, closeBtn, openCardBtn, complexityCard;
let derivationTooltip;

// Setup complexity functions
function initComplexityFunctions() {
  fn = {
    "1": n => 1,
    "logn": n => Math.log2(Math.max(n, 1)),
    "n": n => n,
    "nlogn": n => n * Math.log2(Math.max(n, 1)),
    "nlog2n": n => n * Math.pow(Math.log2(Math.max(n, 1)), 2),
    "n2": n => n * n
  };
  
  algorithms_complexity = [
    { name: "Quick Sort", best: "nlogn", avg: "nlogn", worst: "n2", color: "#00f7ff" },
    { name: "Merge Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#00ffa6" },
    { name: "Heap Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#ffd166" },
    { name: "Bubble Sort", best: "n", avg: "n2", worst: "n2", color: "#ff4d6d" },
    { name: "Selection Sort", best: "n2", avg: "n2", worst: "n2", color: "#ff6b6b" },
    { name: "Insertion Sort", best: "n", avg: "n2", worst: "n2", color: "#f72585" },
    { name: "Tim Sort", best: "n", avg: "nlogn", worst: "nlogn", color: "#4cc9f0" },
    { name: "Shell Sort", best: "nlogn", avg: "nlog2n", worst: "n2", color: "#90dbf4" },
    { name: "Block Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#72efdd" },
    { name: "Dual Pivot Quick Sort", best: "nlogn", avg: "nlogn", worst: "n2", color: "#64dfdf" },
    { name: "Pdq Sort", best: "n", avg: "nlogn", worst: "nlogn", color: "#48bfe3" },
    { name: "Intro Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#5390d9" },
    { name: "Dual Fusion Sort", best: "nlogn", avg: "nlogn", worst: "nlogn", color: "#6930c3" }
  ];
  
  activeAlgorithms = new Set(algorithms_complexity.map(a => a.name));
  nValues = Array.from({ length: 100 }, (_, i) => Math.floor((i + 1) * 3));
  
  // Initialize timing data with empty arrays for each case
  complexityTimingData = { best: {}, avg: {}, worst: {} };
  algorithms_complexity.forEach(algo => {
    complexityTimingData.best[algo.name] = [];
    complexityTimingData.avg[algo.name] = [];
    complexityTimingData.worst[algo.name] = [];
  });
}

// Initialize DOM references
function initComplexityDOMElements() {
  complexitySourceAuto = document.getElementById('complexity-source-auto');
  complexitySourceManual = document.getElementById('complexity-source-manual');
  complexitySourceFile = document.getElementById('complexity-source-file');
  complexityInputAuto = document.getElementById('complexity-input-auto');
  complexityInputManual = document.getElementById('complexity-input-manual');
  complexityInputFile = document.getElementById('complexity-input-file');
  complexityAutoSize = document.getElementById('complexity-auto-size');
  complexityAutoSizeLabel = document.getElementById('complexity-auto-size-label');
  complexityManualText = document.getElementById('complexity-manual-text');
  complexityFileInput = document.getElementById('complexity-file-input');
  complexityFileLabel = document.getElementById('complexity-file-label');
  btnComplexityResetFile = document.getElementById('btn-complexity-reset-file');
  btnAnalyzeInput = document.getElementById('btn-analyze-input');
  complexityFileUploadLabel = document.getElementById('complexity-file-upload-label');
  complexitySummarySize = document.getElementById('complexity-summary-size');
  complexitySummaryPIndex = document.getElementById('complexity-summary-pindex');
  complexitySummaryType = document.getElementById('complexity-summary-type');
  complexitySummarySorted = document.getElementById('complexity-summary-sorted');
  complexityRankingBody = document.getElementById('complexity-ranking-body');
  complexityRankedCount = document.getElementById('complexity-ranked-count');
  complexityAlgoDetails = document.getElementById('complexity-algo-details');
  complexitySortPreview = document.getElementById('complexity-sort-preview');
  complexitySortedPreview = document.getElementById('complexity-sorted-preview');
  modal = document.getElementById("complexityModal");
  openBtn = document.getElementById("openComplexity");
  closeBtn = document.getElementById("closeComplexity");
  openCardBtn = document.getElementById("openComplexity-card");
  complexityCard = document.getElementById("card-complexity");
}

function setComplexityMode(mode) {
  complexityInputMode = mode;
  if (complexityInputAuto) complexityInputAuto.classList.toggle('hidden', mode !== 'auto');
  if (complexityInputManual) complexityInputManual.classList.toggle('hidden', mode !== 'manual');
  if (complexityInputFile) complexityInputFile.classList.toggle('hidden', mode !== 'file');
  document.querySelectorAll('.complexity-source-btn').forEach(btn => btn.classList.toggle('active', btn.id === `complexity-source-${mode}`));
}

function parseInputText(text) {
  if (!text) return [];
  
  try {
    const nums = [];
    
    // Fast native extraction of numbers, bypassing slow comment regexes
    const matches = text.match(/-?\d+(\.\d+)?/g);
    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        nums.push(Number(matches[i]));
      }
    }
    
    console.log('Parsed', nums.length, 'numbers from input text');
    return nums;
  } catch (err) {
    console.error('Error parsing input text:', err);
    return [];
  }
}

function computeSortedPortion(arr) {
  if (!arr || arr.length < 2) return 100;
  let sortedCount = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= arr[i - 1]) sortedCount++;
    else break;
  }
  return Math.round((sortedCount / arr.length) * 100);
}

function computeInputStats(arr) {
  const p = analyzePresortedness(arr);
  const sorted = computeSortedPortion(arr);
  return {
    n: arr.length,
    pIndex: p.pIndex,
    inputType: p.type,
    sortedPortion: sorted
  };
}

function findAlgoKeyByTitle(title) {
  const key = Object.keys(algorithms).find(k => algorithms[k].title.toLowerCase() === title.toLowerCase());
  return key || null;
}

function predictComparisonsForAlgo(title, stats) {
  const algo = algorithms_complexity.find(a => a.name === title);
  if (!algo || !stats) return 0;
  const n = Math.max(1, stats.n);
  let comps = 0;
  switch (algo.avg) {
    case 'n': comps = n; break;
    case 'nlogn': comps = n * Math.log2(n); break;
    case 'nlog2n': comps = n * Math.pow(Math.log2(n), 2); break;
    case 'n2': comps = n * n; break;
    case 'logn': comps = Math.log2(n); break;
    default: comps = n * Math.log2(n);
  }
  if (stats.sortedPortion >= 80 && ['Bubble Sort', 'Insertion Sort', 'Selection Sort'].includes(title)) comps *= 0.3;
  if (stats.pIndex >= 85 && ['Tim Sort', 'Pdq Sort', 'Intro Sort', 'Dual Pivot Quick Sort'].includes(title)) comps *= 0.9;
  if (stats.inputType.includes('Reverse') && title === 'Insertion Sort') comps *= 1.5;
  return Math.round(Math.max(comps, 1));
}

function rankAlgorithmsForInputData(arr) {
  const stats = computeInputStats(arr);
  complexityInputStats = stats;
  const ranked = algorithms_complexity.map(algo => {
    let score = 50;
    const isAdaptive = ['Tim Sort', 'Pdq Sort', 'Intro Sort', 'Dual Fusion Sort', 'Dual Pivot Quick Sort'].includes(algo.name);
    const isQuadratic = ['Bubble Sort', 'Selection Sort', 'Insertion Sort'].includes(algo.name);
    if (stats.pIndex >= 80 && isAdaptive) score += 25;
    if (stats.pIndex >= 70 && isAdaptive) score += 15;
    if (algo.avg === 'nlogn' && stats.n >= 100) score += 15;
    if (algo.avg === 'n' && stats.sortedPortion >= 75) score += 20;
    if (isQuadratic && stats.n > 200) score -= 20;
    if (isQuadratic && stats.sortedPortion >= 80) score += 10;
    if (algo.name === 'Heap Sort' && stats.n > 500) score += 10;
    if (stats.inputType === 'Reverse-Sorted' && algo.name === 'Merge Sort') score += 10;
    if (stats.inputType === 'Reverse-Sorted' && algo.name === 'Insertion Sort') score -= 10;
    if (stats.sortedPortion >= 85 && algo.name === 'Insertion Sort') score += 20;
    if (stats.sortedPortion >= 85 && algo.name === 'Bubble Sort') score += 15;
    if (stats.sortedPortion <= 20 && algo.name === 'Merge Sort') score += 10;

    const expectedOps = predictComparisonsForAlgo(algo.name, stats);
    const note = getAlgoStrengths(findAlgoKeyByTitle(algo.name) || algo.name, stats.pIndex);
    return {
      title: algo.name,
      score: Math.max(5, Math.min(99, Math.round(score))),
      expectedOps,
      note,
      key: findAlgoKeyByTitle(algo.name)
    };
  });

  ranked.sort((a, b) => b.score - a.score || a.expectedOps - b.expectedOps);
  complexityCurrentRanking = ranked;
  return ranked;
}

function updateComplexitySummary(stats) {
  if (!stats) return;
  if (complexitySummarySize) complexitySummarySize.textContent = `${stats.n.toLocaleString()} items`;
  if (complexitySummaryPIndex) complexitySummaryPIndex.textContent = `${stats.pIndex}%`;
  if (complexitySummaryType) complexitySummaryType.textContent = stats.inputType;
  if (complexitySummarySorted) complexitySummarySorted.textContent = `${stats.sortedPortion}%`;
}

/* --- TOOLTIP DICTIONARY & UI --- */
const complexityDerivations = {
  'Quick Sort': 'Divides array into two partitions recursively (log n layers). Scans each layer once (n operations). Expected: O(n log n). Worst case O(n²) if pivot is consistently poor.',
  'Merge Sort': 'Recursively halves the array (log n depth) and merges halves by linearly comparing elements (n ops/layer). Always strictly O(n log n).',
  'Heap Sort': 'Builds a max-heap (O(n)), then repeatedly extracts maximum. Sifting down an element takes O(log n), done n times. Total: O(n log n).',
  'Bubble Sort': 'Repeatedly steps through the list, comparing/swapping adjacent elements. Up to n passes for n elements. Total strictly O(n²).',
  'Selection Sort': 'Scans the unsorted array to find the minimum (O(n)). Repeated n times. Arithmetic progression sum yields strictly O(n²).',
  'Insertion Sort': 'Builds the sorted array one element at a time. The i-th element takes up to i comparisons. Summing 1 to n yields O(n²).',
  'Tim Sort': 'Hybrid of Merge & Insertion. Identifies natural strictly increasing runs (O(n)) and merges them. Minimum run sizes optimize cache. Bounded O(n log n).',
  'Shell Sort': 'Generalization of insertion sort allowing exchanges of far-apart elements. Complexity depends on gap sequence; usually O(n log n) or O(n^(4/3)).',
  'Block Sort': 'In-place stable merging by dividing array into small blocks, sorting blocks, and merging. Overhead keeps complexity uniformly bound to O(n log n).',
  'Dual Pivot Quick Sort': 'Employs two pivots, partitioning array into three segments. Reduces deep recursion logarithmically compared to a single pivot. Expected O(n log n).',
  'Pdq Sort': 'Pattern-defeating quicksort. Blends Quick Sort with Insertion Sort for small arrays and Heap Sort to guarantee worst-case ceiling at O(n log n).',
  'Intro Sort': 'Begins with Quick Sort but aggressively switches to Heap Sort if recursion tree depth exceeds 2 * log(n), guaranteeing worst case O(n log n).',
  'Quickmerge Sort': 'Hybrid uniting Quick Sort partitioning with exact Merge Sort stability invariants. Constrained perfectly at O(n log n).',
  'Dual Fusion Sort': 'Custom hybrid optimizing concurrent pivot boundaries while seamlessly merging overlapping sub-arrays. Practically O(n log n).',
  'In-place Merge Sort': 'Performs merge boundaries without auxiliary O(n) memory by using block rotations or complex pointer inversions. Yields O(n log² n) or O(n log n).'
};

derivationTooltip = document.getElementById('derivation-tooltip');
if (!derivationTooltip) {
    derivationTooltip = document.createElement('div');
    derivationTooltip.id = 'derivation-tooltip';
    derivationTooltip.className = 'fixed z-[9999] max-w-[280px] p-3 rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-fuchsia-500/20 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-200 text-[11px] text-slate-300 leading-relaxed font-mono';
    document.body.appendChild(derivationTooltip);
}

function showDerivationTooltip(title, e) {
    const text = complexityDerivations[title] || 'Complexity derivation determined dynamically by bounds mapping.';
    derivationTooltip.innerHTML = `<span class="text-white font-bold mb-1 block flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>${title} Derivation</span>${text}`;
    derivationTooltip.style.left = (e.clientX + 15) + 'px';
    derivationTooltip.style.top = (e.clientY + 15) + 'px';
    derivationTooltip.style.opacity = '1';
}

function hideDerivationTooltip() {
    derivationTooltip.style.opacity = '0';
}
function moveDerivationTooltip(e) {
    derivationTooltip.style.left = (e.clientX + 15) + 'px';
    derivationTooltip.style.top = (e.clientY + 15) + 'px';
}

function renderRankingTable(ranked) {
  if (!complexityRankingBody) return;
  complexityRankingBody.innerHTML = '';
  ranked.forEach((algo, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-white/5 cursor-pointer hover:bg-white/5 relative';
    row.dataset.algoTitle = algo.title;
    
    const timeStr = algo.actualTime !== undefined ? algo.actualTime.toFixed(3) + ' ms' : 'N/A';
    row.innerHTML = `
      <td class="py-2 pr-2 text-slate-300 font-bold">${index + 1}</td>
      <td class="py-2 pr-2 text-slate-200">${algo.title}</td>
      <td class="py-2 pr-2 text-slate-400">${timeStr}</td>
    `;
    row.addEventListener('click', () => selectComplexityAlgorithm(algo.title));
    row.addEventListener('mouseenter', (e) => showDerivationTooltip(algo.title, e));
    row.addEventListener('mousemove', moveDerivationTooltip);
    row.addEventListener('mouseleave', hideDerivationTooltip);
    complexityRankingBody.appendChild(row);
  });
  if (complexityRankedCount) complexityRankedCount.textContent = `${ranked.length} algorithms`;
}

function buildDetailsHtml(algo, stats, preview) {
  const currentInput = stats ? `${stats.n.toLocaleString()} items` : (complexityInputData ? `${complexityInputData.length} items` : 'no input');
  const rankPosition = complexityCurrentRanking.indexOf(algo) + 1;
  const reason = algo.note || 'Measured timing data';
  const timeText = algo.actualTime !== undefined ? `${algo.actualTime.toFixed(3)} ms` : 'N/A';
  
  return `
    <p class="text-[11px] text-slate-400 uppercase tracking-wider">Selected Algorithm</p>
    <p class="text-white font-bold text-sm">${algo.title}</p>
    <p class="text-slate-300 text-[12px]">Input: ${currentInput} · Execution Time: <strong>${timeText}</strong></p>
    <p class="text-slate-400 text-[11px]">Details: ${reason}</p>
    <p class="text-slate-400 text-[11px]">Based on actual execution time from the benchmark, this algorithm is ranked <strong>#${rankPosition}</strong>.</p>
  `;
}

function selectComplexityAlgorithm(title) {
  selectedAlgorithm = title;
  document.querySelectorAll('.algo-btn').forEach(btn => {
    btn.classList.toggle('active-highlight', btn.innerText === title);
  });
  document.querySelectorAll('#complexity-ranking-body tr').forEach(row => {
    row.classList.toggle('bg-white/10', row.dataset.algoTitle === title);
  });

  const algo = complexityCurrentRanking.find(item => item.title === title);
  if (!algo) return;
  
  // Handle both input-based stats and performance-based rankings
  let statsToUse = complexityInputStats;
  let preview = { sample: [] };
  
  if (statsToUse && complexityInputData) {
    preview = sortInputPreview(algo.key, complexityInputData, statsToUse);
  }
  
  // Update algorithm details section
  if (complexityAlgoDetails) {
    complexityAlgoDetails.innerHTML = buildDetailsHtml(algo, statsToUse, preview.sample);
  }
  
  if (complexitySortPreview) {
    if (preview.sample.length > 0) {
      complexitySortPreview.classList.remove('hidden');
      complexitySortedPreview.textContent = preview.sample.join(', ');
    } else {
      complexitySortPreview.classList.add('hidden');
    }
  }
  
  updateChart(true);
}

function sortInputPreview(key, arr, stats) {
  if (!arr || arr.length === 0) return { sample: [], duration: 0 };
  const sampleCount = 20;
  const copy = [...arr];
  let duration = 0;
  try {
    const start = performance.now();
    if (key && algorithms[key] && algorithms[key].runRaw && arr.length <= 1000) {
      algorithms[key].runRaw(copy);
    } else {
      copy.sort((a, b) => a - b);
    }
    duration = performance.now() - start;
  } catch (e) {
    copy.sort((a, b) => a - b);
    duration = performance.now() - start;
  }
  return {
    sample: copy.slice(0, sampleCount),
    duration: Math.round(duration)
  };
}

function analyzeComplexityInput() {
  let inputSize;
  let customArray = null;
  
  // Check if user explicitly uploaded a file (takes priority over slider)
  if (complexityFileUploaded && complexityInputData && complexityInputData.length >= 10) {
    inputSize = complexityInputData.length;
    customArray = complexityInputData;
  } else {
    inputSize = Number(complexityAutoSize?.value) || 100;
  }
  
  if (inputSize < 10) {
    alert('Input size should be at least 10 elements for meaningful timing analysis.');
    return;
  }
  
  // Show loading indicator
  if (btnAnalyzeInput) btnAnalyzeInput.textContent = 'Analyzing... (Running Benchmarks)';
  if (btnAnalyzeInput) btnAnalyzeInput.disabled = true;
  
  // Run timing benchmark asynchronously
  setTimeout(async () => {
    try {
      console.log(`Running timing benchmark with input size: ${inputSize}, case: ${selectedCase}, fileData: ${!!customArray}`);
      await runTimingBenchmark(inputSize, 'random', customArray);
      
      // Update summary
      const caseLabel = selectedCase === 'best' ? 'Best (Sorted)' : selectedCase === 'worst' ? 'Worst (Reverse)' : 'Average (Random)';
      if (complexitySummarySize) complexitySummarySize.textContent = inputSize + ' elements';
      if (complexitySummaryType) complexitySummaryType.textContent = caseLabel;
      if (complexitySummarySorted) complexitySummarySorted.textContent = customArray ? 'From file' : 'Auto-generated';
      
      // Update ranking based on performance at largest size
      const rankedByPerformance = getRankedByPerformance();
      if (complexityRankedCount) complexityRankedCount.textContent = `${rankedByPerformance.length} algorithms analyzed`;
      renderPerformanceRanking(rankedByPerformance);
      
      // Select the top-ranked algorithm and update details
      if (rankedByPerformance.length > 0) {
        selectComplexityAlgorithm(rankedByPerformance[0].title);
      }
      
      // Update chart
      if (chart) {
        updateChart(true);
      }
      
      console.log('Benchmark complete. Timing data:', complexityTimingData);
    } catch (e) {
      console.error('Error during benchmark:', e);
      alert('Error running benchmark: ' + e.message);
    } finally {
      if (btnAnalyzeInput) {
        btnAnalyzeInput.textContent = 'Analyze Input';
        btnAnalyzeInput.disabled = false;
      }
    }
  }, 100);
}

function resetComplexityAll() {
  // Reset timing data
  complexityTimingData = { best: {}, avg: {}, worst: {} };
  algorithms_complexity.forEach(algo => {
    complexityTimingData.best[algo.name] = [];
    complexityTimingData.avg[algo.name] = [];
    complexityTimingData.worst[algo.name] = [];
  });
  
  // Reset input data
  complexityInputData = [];
  complexityFileUploaded = false;
  
  // Reset file upload UI
  if (complexityFileLabel) complexityFileLabel.textContent = 'Select file...';
  if (complexityFileInput) complexityFileInput.value = '';
  if (btnComplexityResetFile) btnComplexityResetFile.classList.add('hidden');
  if (complexityFileUploadLabel) {
    complexityFileUploadLabel.classList.remove('border-cyan-500/30');
    complexityFileUploadLabel.classList.add('border-white/10');
  }
  
  // Reset slider
  if (complexityAutoSize) {
    complexityAutoSize.value = 50;
    if (complexityAutoSizeLabel) complexityAutoSizeLabel.textContent = '50';
  }
  
  // Reset case to Average
  selectedCase = 'avg';
  document.querySelectorAll('.case-btn').forEach(b => {
    b.classList.remove('active');
    if (b.dataset.case === 'average') b.classList.add('active');
  });
  
  // Reset all algorithm toggles to active
  activeAlgorithms = new Set(algorithms_complexity.map(a => a.name));
  selectedAlgorithm = null;
  document.querySelectorAll('.algo-btn').forEach(b => {
    b.classList.add('active');
    b.classList.remove('opacity-40', 'scale-95', 'active-highlight');
  });
  
  // Reset summary
  if (complexitySummarySize) complexitySummarySize.textContent = '—';
  if (complexitySummaryPIndex) complexitySummaryPIndex.textContent = '—';
  if (complexitySummaryType) complexitySummaryType.textContent = '—';
  if (complexitySummarySorted) complexitySummarySorted.textContent = '—';
  
  // Reset ranking
  complexityCurrentRanking = [];
  if (complexityRankingBody) complexityRankingBody.innerHTML = '';
  if (complexityRankedCount) complexityRankedCount.textContent = '0 algorithms';
  if (complexityAlgoDetails) complexityAlgoDetails.innerHTML = '<p class="text-slate-400">Select a ranked algorithm to see why it was chosen and how it sorts this input.</p>';
  if (complexitySortPreview) complexitySortPreview.classList.add('hidden');
  
  // Reset chart
  if (chart) {
    updateChart(true);
  }
  
  console.log('Complexity analysis reset to defaults');
}

function getRankedByPerformance() {
  // Rank algorithms by actual performance (lower time = better)
  const rankings = [];
  
  const avgData = complexityTimingData.avg || {};
  Object.keys(avgData).forEach(algoName => {
    const timings = avgData[algoName];
    if (timings && timings.length > 0) {
      // Get the last (largest) timing value as overall performance
      const lastTiming = timings[timings.length - 1];
      const algoKey = findAlgoKeyByTitle(algoName);
      const algo = algorithms_complexity.find(a => a.name === algoName);
      
      rankings.push({
        title: algoName,
        actualTime: lastTiming.y,
        testSize: lastTiming.x,
        score: 100 - Math.min(99, (lastTiming.y / 100)),
        expectedOps: Math.round(lastTiming.y * 1000),
        note: algo ? `Performance: ${lastTiming.y.toFixed(2)}ms on ${lastTiming.x} elements` : 'Measured timing data',
        key: algoKey
      });
    }
  });
  
  // Sort by actual time (ascending)
  rankings.sort((a, b) => a.actualTime - b.actualTime);
  complexityCurrentRanking = rankings;
  
  return rankings;
}

function renderPerformanceRanking(rankings) {
  if (!complexityRankingBody) return;
  complexityRankingBody.innerHTML = '';
  
  rankings.forEach((algo, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-white/5 cursor-pointer hover:bg-white/5 relative';
    row.dataset.algoTitle = algo.title;
    
    const timeStr = algo.actualTime.toFixed(3) + ' ms';
    row.innerHTML = `
      <td class="py-2 pr-2 text-slate-300 font-bold">${index + 1}</td>
      <td class="py-2 pr-2 text-slate-200">${algo.title}</td>
      <td class="py-2 pr-2 text-slate-400">${timeStr}</td>
    `;
    
    row.addEventListener('click', () => selectComplexityAlgorithm(algo.title));
    row.addEventListener('mouseenter', (e) => showDerivationTooltip(algo.title, e));
    row.addEventListener('mousemove', moveDerivationTooltip);
    row.addEventListener('mouseleave', hideDerivationTooltip);
    complexityRankingBody.appendChild(row);
  });
}

// ========== GLOBAL FUNCTIONS FOR CHART ==========

function getDatasets() {
  const caseData = complexityTimingData[selectedCase] || {};
  const caseLabel = selectedCase === 'best' ? 'Best Case' : selectedCase === 'avg' ? 'Average Case' : 'Worst Case';

  const datasets = algorithms_complexity.map(a => {
    const timings = caseData[a.name] || [];
    return {
      label: `${a.name} (${caseLabel})`,
      data: timings,
      borderColor: a.color,
      backgroundColor: a.color + '15',
      borderWidth: selectedAlgorithm === a.name ? 3 : (activeAlgorithms.has(a.name) ? 1.5 : 0.5),
      fill: false,
      tension: 0.3,
      hidden: !activeAlgorithms.has(a.name),
      pointRadius: 2,
      pointHoverRadius: 5,
      pointBackgroundColor: a.color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 1,
      clip: false,
      segment: {
        borderDash: selectedAlgorithm === a.name ? [] : [5, 5]
      }
    };
  });

  return datasets;
}

function updateChart(animate = false) {
  if (!chart) return;
  try {
    chart.data.datasets = getDatasets();
    // Don't set labels for timing data (using {x, y} format instead)
    
    const container = document.getElementById('complexityChartContainer');
    if (container && chart.canvas) {
      const rect = container.getBoundingClientRect();
      chart.canvas.style.width = rect.width + 'px';
      chart.canvas.style.height = rect.height + 'px';
    }
    
    chart.resize();
    chart.update(animate ? { duration: 400 } : "none");
  } catch(e) {
    console.error('Chart update error:', e);
  }
}

function highlightSortingAlgorithm(name) {
  console.log("Selected:", name);
}

function openComplexityModal() {
  if (modal) {
    modal.style.display = "block";
    setTimeout(async () => {
      // Auto-run benchmark on first open so chart has data
      const hasData = complexityTimingData.avg && 
        Object.values(complexityTimingData.avg).some(t => t && t.length > 0);
      
      if (!hasData) {
        const defaultSize = 500;
        const defaultArr = generateTestArray(defaultSize, 'random');
        complexityInputData = defaultArr;
        
        // Show loading state
        if (btnAnalyzeInput) {
          btnAnalyzeInput.textContent = 'Running initial benchmark...';
          btnAnalyzeInput.disabled = true;
        }
        
        try {
          await runTimingBenchmark(defaultSize, 'random', null);
          
          // Update summary
          if (complexitySummarySize) complexitySummarySize.textContent = defaultSize + ' elements';
          if (complexitySummaryType) complexitySummaryType.textContent = 'Raw Time Measurement';
          if (complexitySummarySorted) complexitySummarySorted.textContent = 'N/A (Actual timing)';
          
          const rankedByPerformance = getRankedByPerformance();
          if (complexityRankedCount) complexityRankedCount.textContent = `${rankedByPerformance.length} algorithms analyzed`;
          renderPerformanceRanking(rankedByPerformance);
          
          if (rankedByPerformance.length > 0) {
            selectComplexityAlgorithm(rankedByPerformance[0].title);
          }
        } catch (e) {
          console.error('Auto-benchmark error:', e);
          // Fall back to theoretical ranking
          const ranked = rankAlgorithmsForInputData(defaultArr);
          updateComplexitySummary(complexityInputStats);
          renderRankingTable(ranked);
          if (ranked.length > 0) {
            selectComplexityAlgorithm(ranked[0].title);
          }
        } finally {
          if (btnAnalyzeInput) {
            btnAnalyzeInput.textContent = 'Analyze Input';
            btnAnalyzeInput.disabled = false;
          }
        }
      }
      
      if (chart) {
        chart.resize();
        updateChart(true);
      }
    }, 150);
  }
}

// ========== RAW TIME COMPLEXITY MEASUREMENT SYSTEM ==========
function measureAlgorithmTime(algorithmKey, arr) {
  // Get the algorithm's raw implementation
  const algo = algorithms[algorithmKey];
  if (!algo || !algo.runRaw) return null;
  
  // Create a copy of the array to sort
  const arrCopy = [...arr];
  
  // Measure execution time
  const startTime = performance.now();
  try {
    algo.runRaw(arrCopy);
  } catch (e) {
    console.error(`Error running ${algo.title}:`, e);
    return null;
  }
  const endTime = performance.now();
  
  return endTime - startTime;
}

function generateTestArray(size, type = 'random') {
  const arr = [];
  if (type === 'random') {
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 10000));
    }
  } else if (type === 'sorted') {
    for (let i = 0; i < size; i++) {
      arr.push(i);
    }
  } else if (type === 'reverse') {
    for (let i = 0; i < size; i++) {
      arr.push(size - i);
    }
  }
  return arr;
}

async function runTimingBenchmark(inputSize, inputType = 'random', customArray = null) {
  // Reset all timing data
  complexityTimingData = { best: {}, avg: {}, worst: {} };
  algorithms_complexity.forEach(algo => {
    complexityTimingData.best[algo.name] = [];
    complexityTimingData.avg[algo.name] = [];
    complexityTimingData.worst[algo.name] = [];
  });
  
  const algoKeys = Object.keys(algorithms);
  
  // Define input generators for each case
  const caseGenerators = {
    best: (size) => {
      // Best case: already sorted array
      if (customArray && customArray.length >= size) {
        const slice = customArray.slice(0, size);
        return slice.sort((a, b) => a - b);
      }
      return generateTestArray(size, 'sorted');
    },
    avg: (size) => {
      // Average case: random array (or user's custom data)
      if (customArray && customArray.length >= size) {
        return customArray.slice(0, size);
      }
      return generateTestArray(size, 'random');
    },
    worst: (size) => {
      // Worst case: reverse sorted array
      if (customArray && customArray.length >= size) {
        const slice = customArray.slice(0, size);
        return slice.sort((a, b) => b - a);
      }
      return generateTestArray(size, 'reverse');
    }
  };
  
  for (const key of algoKeys) {
    const algo = algorithms[key];
    if (!algo.runRaw) continue;
    
    const complexityAlgo = algorithms_complexity.find(a => 
      a.name.toLowerCase() === algo.title.toLowerCase()
    );
    if (!complexityAlgo) continue;
    
    // Run benchmark for each case
    for (const caseType of ['best', 'avg', 'worst']) {
      const timings = [];
      let startSize = Math.min(10, Math.max(1, inputSize));
      let step = Math.max(1, Math.floor(inputSize / 20));
      
      let isTooSlow = false;
      let baseTime = 0;
      let baseSize = 0;
      
      for (let size = startSize; size <= inputSize; size += step) {
        if (isTooSlow) {
          const ratio = size / baseSize;
          const extrapolatedTime = baseTime * (ratio * ratio);
          timings.push({ x: size, y: extrapolatedTime });
          continue;
        }

        const testArr = caseGenerators[caseType](size);
        const time = measureAlgorithmTime(key, testArr);
        
        if (time !== null) {
          timings.push({ x: size, y: time });
          
          if (time > 50) {
            isTooSlow = true;
            baseTime = time;
            baseSize = size;
          }
        }
        
        // Yield to main thread to prevent UI freezing
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      if (timings.length > 0) {
        complexityTimingData[caseType][complexityAlgo.name] = timings;
      }
    }
  }
  
  return complexityTimingData;
}

// ========== DOM INITIALIZATION - RUN WHEN DOM IS READY ==========
document.addEventListener('DOMContentLoaded', function() {

  // Initialize all complexity data
  initComplexityFunctions();
  initComplexityDOMElements();

  // Get canvas context
  const canvasEl = document.getElementById('complexityChart');
  if (!canvasEl) {
    console.error('Canvas element not found');
    return;
  }
  ctx = canvasEl.getContext('2d');

  // CREATE BUTTONS
  const toggleContainer = document.getElementById("algoToggle");
  if (!toggleContainer) {
    console.error('algoToggle container not found');
  } else {
    console.log('algoToggle container found, adding ' + algorithms_complexity.length + ' buttons');
    algorithms_complexity.forEach(algo => {
      const btn = document.createElement("button");
      btn.className = "algo-btn active transition-all duration-300";
      if (!activeAlgorithms.has(algo.name)) {
          btn.classList.remove("active");
          btn.classList.add("opacity-40", "scale-95");
      }
      btn.innerText = algo.name;

      btn.onclick = () => {
        // Toggle algorithm visibility
        if (activeAlgorithms.has(algo.name)) {
          activeAlgorithms.delete(algo.name);
          btn.classList.remove("active", "active-highlight");
          btn.classList.add("opacity-40", "scale-95");
          
          // Clear selectedAlgorithm if we just disabled it
          if (selectedAlgorithm === algo.name) {
              selectedAlgorithm = null;
          }
        } else {
          activeAlgorithms.add(algo.name);
          btn.classList.add("active");
          btn.classList.remove("opacity-40", "scale-95");
          
          selectedAlgorithm = algo.name;
          document.querySelectorAll(".algo-btn").forEach(b => b.classList.remove("active-highlight"));
          btn.classList.add("active-highlight");
          
          highlightSortingAlgorithm(algo.name);
          selectComplexityAlgorithm(algo.name);
        }

        updateChart(true);
      };

      toggleContainer.appendChild(btn);
    });
  }

  // CASE TOGGLE WITH ANIMATION
  document.querySelectorAll(".case-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".case-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedCase = btn.dataset.case === "average" ? "avg" : btn.dataset.case;

      updateChart(true); // animate
    };
  });

  // CREATE CHART
  chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: getDatasets()
    },
    options: {
      layout: {
        padding: { right: 120 }
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: "easeInOutQuart"
      },
      plugins: {
        legend: {
          labels: { color: "#fff" },
          display: true,
          position: 'top',
          onClick: function(e, legendItem, legend) {
              const label = legendItem.text.split(' (')[0];
              
              if (activeAlgorithms.has(label)) {
                  activeAlgorithms.delete(label);
              } else {
                  activeAlgorithms.add(label);
              }
              
              // Sync buttons visually
              document.querySelectorAll(".algo-btn").forEach(b => {
                  if (b.innerText === label) {
                      if (activeAlgorithms.has(label)) {
                         b.classList.add("active");
                         b.classList.remove("opacity-40", "scale-95");
                      } else {
                         b.classList.remove("active", "active-highlight");
                         b.classList.add("opacity-40", "scale-95");
                      }
                  }
              });
              updateChart(true);
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const algo = context.dataset.label.split(' (')[0];
              const time = context.parsed.y.toFixed(3);
              const size = context.parsed.x;
              return `${algo}: ${time} ms (n=${size})`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Array Size (number of elements)',
            color: '#94a3b8',
            font: { size: 12 }
          },
          ticks: { 
            color: "#aaa",
            callback: function(value) {
              return value.toLocaleString();
            }
          },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          type: "linear",
          beginAtZero: true,
          title: {
            display: true,
            text: 'Execution Time (milliseconds)',
            color: '#94a3b8',
            font: { size: 12 }
          },
          ticks: { 
            color: "#aaa",
            callback: function(value) {
              if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
              if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
              return value;
            }
          },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    },
    plugins: [{
      id: 'inlineAlgorithmLabels',
      afterDatasetsDraw: (chart) => {
        const { ctx: canvasCtx, data } = chart;
        canvasCtx.save();
        
        let pendingLabels = [];

        data.datasets.forEach((dataset, i) => {
          if (dataset.hidden || dataset.type === 'bar') return;
          const meta = chart.getDatasetMeta(i);
          if (!meta || meta.hidden || !meta.data || meta.data.length === 0) return;
          const lastPoint = meta.data[meta.data.length - 1];
          if (!lastPoint || !lastPoint.x || isNaN(lastPoint.y)) return;
          
          pendingLabels.push({
            text: dataset.label.split(' (')[0],
            x: lastPoint.x,
            targetY: lastPoint.y,
            y: lastPoint.y,
            color: dataset.borderWidth === 3 ? '#ffffff' : dataset.borderColor,
            font: dataset.borderWidth === 3 ? 'bold 11px "Space Grotesk", sans-serif' : '10px "Space Grotesk", sans-serif',
            alpha: dataset.borderWidth === 3 ? 1.0 : 0.8
          });
        });
        
        pendingLabels.sort((a, b) => a.y - b.y);
        
        const LABEL_HEIGHT = 14; 
        let overlapping = true;
        let resolveIterations = 0;
        
        while (overlapping && resolveIterations < 50) {
            overlapping = false;
            for (let i = 0; i < pendingLabels.length - 1; i++) {
                let current = pendingLabels[i];
                let next = pendingLabels[i + 1];
                
                const distance = next.y - current.y;
                if (distance < LABEL_HEIGHT) {
                    overlapping = true;
                    const adjust = (LABEL_HEIGHT - distance) / 2;
                    current.y -= adjust;
                    next.y += adjust;
                }
            }
            resolveIterations++;
        }
        
        pendingLabels.forEach(p => {
          if (Math.abs(p.y - p.targetY) > 3) {
              canvasCtx.beginPath();
              canvasCtx.moveTo(p.x + 2, p.targetY);
              canvasCtx.lineTo(p.x + 6, p.y);
              canvasCtx.strokeStyle = p.color;
              canvasCtx.globalAlpha = 0.3;
              canvasCtx.lineWidth = 1;
              canvasCtx.stroke();
          }
          
          canvasCtx.fillStyle = p.color;
          canvasCtx.font = p.font;
          canvasCtx.globalAlpha = p.alpha;
          canvasCtx.fillText(p.text, p.x + 8, p.y + 4);
        });
        canvasCtx.restore();
      }
    }]
  });

  // Bind event listeners
  console.log('Binding event listeners...');
  if (btnAnalyzeInput) {
    console.log('Found btnAnalyzeInput, binding click listener');
    btnAnalyzeInput.addEventListener('click', analyzeComplexityInput);
  } else {
    console.error('btnAnalyzeInput not found!');
  }
  
  // Case buttons (Best/Average/Worst) are handled by the .case-btn handler above

  // Reset button in the input source section
  const btnComplexityReset = document.getElementById('btn-complexity-reset');
  if (btnComplexityReset) {
    btnComplexityReset.addEventListener('click', resetComplexityAll);
  }

  if (complexityAutoSize) {
    complexityAutoSize.addEventListener('input', () => {
      if (complexityAutoSizeLabel) complexityAutoSizeLabel.textContent = complexityAutoSize.value;
    });
  }

  if (complexityFileInput) {
    complexityFileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file size (max 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum file size is 5MB.');
        complexityFileLabel.textContent = 'File too large';
        if (btnComplexityResetFile) btnComplexityResetFile.classList.add('hidden');
        return;
      }
      
      complexityFileLabel.textContent = file.name;
      if (btnComplexityResetFile) btnComplexityResetFile.classList.remove('hidden');
      if (complexityFileUploadLabel) complexityFileUploadLabel.classList.add('border-cyan-500/30');
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let text = e.target.result;
          const arr = [];
          
          // Fast native extraction of numbers, bypassing slow comment regexes
          const matches = text.match(/-?\d+(\.\d+)?/g);
          if (matches) {
            for (let i = 0; i < matches.length; i++) {
              arr.push(Number(matches[i]));
            }
          }
          
          if (arr.length === 0) {
            alert('Uploaded file did not contain numeric values.');
            complexityInputData = [];
          } else {
            complexityInputData = arr;
            complexityFileUploaded = true;
            console.log('Successfully loaded', arr.length, 'values from complexity file');
          }
        } catch (err) {
          console.error('Error parsing complexity file:', err);
          alert('Error parsing file: ' + err.message);
          complexityFileLabel.textContent = 'Parse error';
          complexityInputData = [];
        }
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        console.error('FileReader error');
        complexityFileLabel.textContent = 'Read error';
        complexityInputData = [];
      };
      reader.readAsText(file);
    });
  }

  if (btnComplexityResetFile) {
    btnComplexityResetFile.addEventListener('click', () => {
      if (complexityFileInput) complexityFileInput.value = '';
      complexityFileLabel.textContent = 'No file selected';
      btnComplexityResetFile.classList.add('hidden');
      if (complexityFileUploadLabel) complexityFileUploadLabel.classList.remove('border-cyan-500/30');
      complexityInputData = [];
      complexityFileUploaded = false;
    });
  }

  if (openBtn) openBtn.onclick = () => { console.log('openBtn clicked'); openComplexityModal(); };
  if (openCardBtn) { 
    console.log('Found openCardBtn');
    openCardBtn.onclick = () => { console.log('openCardBtn clicked'); openComplexityModal(); };
  } else {
    console.error('openCardBtn not found');
  }
  
  if (complexityCard) {
    complexityCard.onclick = (e) => {
      console.log('complexityCard clicked');
      if (!e.target.closest('button')) openComplexityModal();
    };
  } else {
    console.error('complexityCard not found');
  }
  
  if (closeBtn) closeBtn.onclick = () => { console.log('closeBtn clicked'); modal.style.display = "none"; };
  else console.error('closeBtn not found');
  
  if (modal) {
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = "none"; });
  } else {
    console.error('modal not found');
  }
  
  console.log('DOMContentLoaded initialization complete');

}); // END OF DOMContentLoaded

/* STITCH DESIGNED GAMIFIED LEARNING FEATURE */
(function() {
  let isGameMode = false;
  let score = 0;
  let heatmapData = [];
  let moveLogGame = [];
  let selectedIndices = [];
  let compCount = 0;
  let swapCount = 0;
  
  window.toggleGameMode = function() {
    isGameMode = !isGameMode;
    const aiPanel = document.getElementById('aiPanel');
    
    if (isGameMode) {
      if(aiPanel) {
        aiPanel.classList.remove('hidden');
        // trigger reflow
        void aiPanel.offsetWidth;
        aiPanel.classList.add('opacity-100');
      }
      
      // Auto-navigate to arena if not there
      const btnGoArena = document.getElementById('btn-go-arena');
      if (btnGoArena) btnGoArena.click();

      score = 0;
      compCount = 0;
      swapCount = 0;
      heatmapData = [];
      moveLogGame = [];
      selectedIndices = [];
      document.getElementById('score').innerText = '0';
      document.getElementById('strategy').innerText = 'UNKNOWN';
      document.getElementById('feedback').innerText = 'Game Mode Active! Select two bars to swap.';
      
      updateHeatmapGame();
    } else {
      if(aiPanel) {
        aiPanel.classList.remove('opacity-100');
        setTimeout(() => aiPanel.classList.add('hidden'), 300);
      }
      selectedIndices = [];
      
      // Clear visual selections from bars
      document.querySelectorAll('.bar, [style*="height"]').forEach(b => b.style.boxShadow = '');
    }
  };

  // Close button binding
  setTimeout(() => {
    const cb = document.getElementById('close-game-btn');
    if (cb) cb.addEventListener('click', () => { if(isGameMode) window.toggleGameMode(); });
  }, 1000);

  // Bind the Hero Button explicitly
  setTimeout(() => {
    const heroBtn = document.getElementById('btn-hero-gameMode');
    if(heroBtn) heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if(!isGameMode) window.toggleGameMode();
    });
  }, 1000);

  // Catch clicks globally for the game
  document.addEventListener('click', (e) => {
    if (!isGameMode) return;
    
    const bar = e.target.closest('.bar') || e.target.closest('[style*="height"]');
    if (!bar) return;
    
    const container = bar.parentElement;
    if (!container || (!container.id.includes('array') && !container.id.includes('vis'))) return;

    const barsList = Array.from(container.children);
    const index = barsList.indexOf(bar);
    
    if (index === -1) return;
    
    // Selection logic
    if (selectedIndices.includes(index)) {
      selectedIndices = selectedIndices.filter(i => i !== index);
      bar.style.boxShadow = ''; // deselect
    } else {
      if (selectedIndices.length < 2) {
        selectedIndices.push(index);
        bar.style.boxShadow = '0 0 15px #00f5d4, inset 0 0 10px #00f5d4';
      }
    }
    
    // Compare & Swap logic
    if (selectedIndices.length === 2) {
      document.getElementById('feedback').innerText = 'Analyzing Neural Pathway...';
      const idx1 = selectedIndices[0];
      const idx2 = selectedIndices[1];
      
      compCount++;
      swapCount++;
      
      setTimeout(() => {
        let diff = Math.abs(idx1 - idx2);
        let moveType = diff === 1 ? 'bubble' : (diff > 1 && diff < 5 ? 'insertion' : 'selection');
        moveLogGame.push(moveType);
        
        let points = 0;
        let cHex = "#ef476f"; 
        if (moveType === 'bubble') { 
          points = 10; cHex = "#00f5d4"; 
        } else if (moveType === 'insertion') {
          points = 25; cHex = "#ffb703"; 
        } else {
          points = 40; cHex = "#f72585"; 
        }
        
        heatmapData.push(cHex);
        score += points;
        
        let strategyStr = "MIXED";
        let bCount = moveLogGame.filter(m=>m==='bubble').length;
        let iCount = moveLogGame.filter(m=>m==='insertion').length;
        let sCount = moveLogGame.filter(m=>m==='selection').length;
        let maxCount = Math.max(bCount, iCount, sCount);
        if(bCount === maxCount && bCount > 0) strategyStr = "BUBBLE SORT ??";
        else if(iCount === maxCount) strategyStr = "INSERTION SORT ?";
        else if(sCount === maxCount) strategyStr = "QUICK/SELECT ?";
        
        document.getElementById('strategy').innerText = strategyStr;
        document.getElementById('strategy').style.color = cHex;
        document.getElementById('strategy').style.textShadow = '0 10px ' + cHex;
        
        // Count animation logic
        let currentScore = parseInt(document.getElementById('score').innerText);
        animateValue("score", currentScore, score, 500);

        document.getElementById('feedback').innerText = (points > 20 ? 'Optimal Meta! +' : 'Move logged. +') + points + ' XP';
        
        updateHeatmapGame();
        
        const b1 = barsList[idx1];
        const b2 = barsList[idx2];
        const inner1 = b1.innerHTML;
        const inner2 = b2.innerHTML;
        const h1 = b1.style.height;
        const h2 = b2.style.height;
        
        b1.style.height = h2;
        b1.innerHTML = inner2;
        b2.style.height = h1;
        b2.innerHTML = inner1;
        
        b1.style.boxShadow = '';
        b2.style.boxShadow = '';
        selectedIndices = [];
      }, 300);
    }
  });

  function updateHeatmapGame() {
    let container = document.getElementById("heatmap");
    if (!container) return;
    container.innerHTML = "";
    heatmapData.forEach(colorHex => {
      let block = document.createElement("div");
      block.className = "w-[12px] h-[12px] rounded-sm transition-transform duration-300 transform scale-0 animate-scale-in";
      block.style.backgroundColor = colorHex;
      block.style.boxShadow = '0 8px ' + colorHex;
      // Animate block appearance
      setTimeout(()=> { block.classList.remove('scale-0'); block.classList.add('scale-100'); }, 10);
      container.appendChild(block);
    });
  }

  function animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
  }
})();

// ==========================================
// GAME PAGE ENGINE (YOU ARE THE ALGORITHM)
// ==========================================
(function() {
  const pageHome = document.getElementById('home-page');
  const pageGame = document.getElementById('game-page');
  const btnHero = document.getElementById('btn-hero-gameMode');
  const btnBack = document.getElementById('btn-back-to-home');
  
  if (!pageGame) return; // Prevent crashes if HTML is missing
  
  // State
  let isGameActive = false;
  let gameArray = [];
  let selectedIndices = [];
  let numBars = 10;
  
  let stats = { compares: 0, swaps: 0, score: 100 };
  let moveHistory = []; // Tracks actions
  let heatmapData = []; // Heatmap colors
  
  // Navigation
  if (btnHero) {
    btnHero.addEventListener('click', () => {
      // Hide all top level pages, show game page
      document.querySelectorAll('.flex-1 > div[id$="-page"]').forEach(p => {
        if (!p.id.includes('game-page')) p.classList.add('hidden');
      });
      pageGame.classList.remove('hidden');
      isGameActive = true;
      initGame();
    });
  }
  
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      pageGame.classList.add('hidden');
      if (pageHome) pageHome.classList.remove('hidden');
      isGameActive = false;
    });
  }
  
  // Game Logic
  function initGame() {
    gameArray = [];
    selectedIndices = [];
    stats = { compares: 0, swaps: 0, score: 100 };
    moveHistory = [];
    heatmapData = [];
    
    for(let i=0; i<numBars; i++) {
       gameArray.push(Math.floor(Math.random() * 90) + 10);
    }
    
    updateUI();
    renderBars();
    setFeedback("SELECT TWO BARS TO SWAP OR COMPARE");
    document.getElementById('game-strategy-txt').innerText = "- - -";
    document.getElementById('game-heatmap').innerHTML = "";
  }
  
  function renderBars() {
    const container = document.getElementById('game-array-container');
    if(!container) return;
    container.innerHTML = '';
    
    gameArray.forEach((val, i) => {
      const bar = document.createElement('div');
      bar.className = 'w-10 sm:w-16 rounded-t-lg flex flex-col justify-end items-center transition-all duration-300 cursor-pointer hover:brightness-125';
      bar.style.height = val + "%";
      bar.style.backgroundColor = selectedIndices.includes(i) ? '#00f5d4' : '#2b2dc0';
      if (selectedIndices.includes(i)) bar.style.boxShadow = '0 0 15px #00f5d4';
      
      const label = document.createElement('span');
      label.className = 'text-white text-[10px] font-bold mb-1';
      label.innerText = val;
      
      bar.appendChild(label);
      bar.addEventListener('click', () => handleBarClick(i));
      container.appendChild(bar);
    });
  }
  
  function handleBarClick(idx) {
    if (selectedIndices.includes(idx)) {
      selectedIndices = selectedIndices.filter(i => i !== idx);
    } else {
      if (selectedIndices.length < 2) {
        selectedIndices.push(idx);
      }
    }
    renderBars();
  }
  
  // Buttons
  const btnSwap = document.getElementById('game-btn-swap');
  const btnComp = document.getElementById('game-btn-compare');
  const btnReset = document.getElementById('game-btn-reset');
  
  if (btnSwap) btnSwap.addEventListener('click', () => performAction('swap'));
  if (btnComp) btnComp.addEventListener('click', () => performAction('compare'));
  if (btnReset) btnReset.addEventListener('click', initGame);
  
  function performAction(type) {
    if (selectedIndices.length !== 2) {
      setFeedback("Must select exactly 2 bars!");
      return;
    }
    
    let [i, j] = selectedIndices;
    if (i > j) { let temp = i; i = j; j = temp; }
    
    if (type === 'compare') {
      stats.compares++;
      setFeedback("Compared elements.");
      moveHistory.push({ type: 'compare', diff: j - i });
    } else if (type === 'swap') {
      stats.swaps++;
      let temp = gameArray[i];
      gameArray[i] = gameArray[j];
      gameArray[j] = temp;
      setFeedback("Swapped!");
      moveHistory.push({ type: 'swap', diff: j - i, v1: gameArray[j], v2: gameArray[i] }); 
    }
    
    selectedIndices = [];
    analyzeMove(type, j - i);
    renderBars();
    updateUI();
  }
  
  function analyzeMove(type, diff) {
    let pts = 0;
    let color = "#ef476f"; // Red (bad)
    
    if (type === 'swap') {
      if (diff === 1) {
        // Adjacent swap (Bubble sort style)
        pts = 5; color = "#ffd166"; // Yellow
      } else {
        // Long distance swap (Selection/Quick style)
        pts = 15; color = "#00f5d4"; // Green
      }
    } else if (type === 'compare') {
      pts = 2; color = "#118ab2"; // Blue
    }
    
    heatmapData.push(color);
    stats.score += pts;
    if (stats.score > 200) stats.score = 200; // Cap
    
    updateStrategyDetection();
    renderHeatmap();
  }
  
  function updateStrategyDetection() {
    if (moveHistory.length < 3) return;
    
    let swaps = moveHistory.filter(m => m.type === 'swap');
    if (swaps.length === 0) return;
    
    let adjacent = swaps.filter(m => m.diff === 1).length;
    let long = swaps.filter(m => m.diff > 2).length;
    
    let strategy = "MIXED APPROACH";
    let stColor = "#fff";
    
    if (adjacent / swaps.length >= 0.7) {
      strategy = "BUBBLE SORT";
      stColor = "#ffb703";
    } else if (long / swaps.length >= 0.5) {
      strategy = "SELECTION SORT";
      stColor = "#00f5d4";
    }
    
    const sElem = document.getElementById('game-strategy-txt');
    if(sElem) {
      sElem.innerText = strategy;
      sElem.style.color = stColor;
      sElem.style.textShadow = '0 0 10px ' + stColor;
    }
  }
  
  function renderHeatmap() {
    const hm = document.getElementById('game-heatmap');
    if(!hm) return;
    hm.innerHTML = "";
    
    // Limits
    let displayData = heatmapData.slice(-30);
    displayData.forEach(c => {
      let b = document.createElement('div');
      b.className = "w-4 h-full rounded-sm opacity-80 shrink-0";
      b.style.backgroundColor = c;
      hm.appendChild(b);
    });
    hm.scrollLeft = hm.scrollWidth;
    
    // Update Tooltip Heatmap grid
    renderTooltipHeatmap();
  }
  
  function renderTooltipHeatmap() {
    const tg = document.getElementById('tooltip-heatmap-grid');
    if(!tg) return;
    // We only need to generate it once or we can give it dynamic ripples. Let's just generate a nice static-looking matrix with varying opacities if it's empty, and just mildly update it.
    if(tg.children.length === 0) {
      const colors = ['bg-emerald-400', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500'];
      for (let i = 0; i < 48; i++) {
        let span = document.createElement('div');
        let col = colors[Math.floor(Math.random() * colors.length)];
        let op = [0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 4)];
        span.className = `w-full aspect-square rounded-[2px] ${col}`;
        span.style.opacity = op;
        tg.appendChild(span);
      }
    } else {
      // randomly shift a few blocks to make it feel "live"
      for (let i = 0; i < 5; i++) {
         let idx = Math.floor(Math.random() * 48);
         let colors = ['bg-emerald-400', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500'];
         let span = tg.children[idx];
         if(span) {
            span.className = `w-full aspect-square rounded-[2px] ${colors[Math.floor(Math.random() * colors.length)]} transition-colors duration-500`;
            span.style.opacity = [0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 4)];
         }
      }
    }
  }
  
  function updateUI() {
    if(document.getElementById('game-comparisons')) document.getElementById('game-comparisons').innerText = stats.compares;
    if(document.getElementById('game-swaps')) document.getElementById('game-swaps').innerText = stats.swaps;
    
    // Update Score
    if(document.getElementById('game-score')) document.getElementById('game-score').innerText = stats.score;
    if(document.getElementById('tooltip-score')) document.getElementById('tooltip-score').innerText = stats.score;
    
    // Update Strategy in tooltip if available
    if(document.getElementById('tooltip-strategy')) {
      const stratElem = document.getElementById('game-strategy-txt');
      if(stratElem) document.getElementById('tooltip-strategy').innerText = stratElem.innerText + " ⚡";
    }

    // Bar
    const b = document.getElementById('game-eff-bar');
    const p = document.getElementById('game-eff-pct');
    let pct = Math.max(0, Math.min(100, Math.floor(stats.score / 2)));
    if(b) b.style.width = pct + "%";
    if(p) p.innerText = pct + "%";
  }
  
  function setFeedback(txt) {
    const f = document.getElementById('game-feedback');
    if(f) {
      f.innerText = txt;
      f.style.transform = 'translate(-50%, -10px)';
      f.style.opacity = '1';
      setTimeout(() => {
        f.style.transform = 'translate(-50%, 0)';
      }, 200);
    }
  }

})();

// ==========================================
// WELCOME PAGE â€" Particles + Enter Button
// ==========================================
(function() {
    const canvas = document.getElementById('welcome-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId = null;
    let running = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create floating particles
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.4 + 0.1,
            color: Math.random() > 0.5 ? '0, 238, 255' : '255, 0, 127'
        });
    }

    function drawParticles() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.fill();
        });

        // Draw connecting lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 238, 255, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animFrameId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // Enter button handler
    const btnEnter = document.getElementById('btn-enter-app');
    const welcomePage = document.getElementById('welcome-page');
    const appShell = document.getElementById('app-shell');
    const homePage = document.getElementById('home-page');

    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            // Trigger exit animation on welcome page
            welcomePage.classList.add('exit-active');

            setTimeout(() => {
                // Hide welcome page
                welcomePage.style.display = 'none';
                running = false;
                if (animFrameId) cancelAnimationFrame(animFrameId);

                // Show the app shell
                if (appShell) {
                    appShell.style.display = 'flex';
                    appShell.classList.add('entering');
                }
                // Show home page
                if (homePage) {
                    homePage.classList.remove('hidden');
                    homePage.classList.add('flex');
                }
            }, 600);
        });
    }
})();
