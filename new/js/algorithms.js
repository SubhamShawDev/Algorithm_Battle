const algorithms = {
    'quick-sort': {
        title: 'Quick Sort',
        desc: "A highly efficient sorting algorithm that uses a divide-and-conquer strategy to quickly sort items within an array. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays.",
        best: 'O(n log n)',
        avg: 'O(n log n)',
        worst: 'O(n)',
        space: 'O(n)',
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
        avg: 'O(n2)',
        worst: 'O(n2)',
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
        best: 'O(n2)', avg: 'O(n2)', worst: 'O(n2)', space: 'O(1)',
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
        best: 'O(n)', avg: 'O(n2)', worst: 'O(n2)', space: 'O(1)',
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
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n2)', space: 'O(1)',
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
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n2)', space: 'O(log n)',
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
    } else if (s === 'O(n)' || s === 'O(n^2)') {
        ops = n * n;
    } else if (s === 'O(n)') {
        ops = n;
    } else if (s === 'O(logn)' || s === 'O(log n)') {
        ops = Math.log2(n);
    } else if (s === 'O(1)') {
        ops = 1;
    } else if (s === 'O(n/2)') {
        ops = (n * n) / 2;
    } else {
        // Try to parse generically
        if (s.includes('n')) ops = n * n;
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
    if (s === 'O(n)' || s === 'O(n^2)') return n * n;
    if (s === 'O(n)') return n;
    if (s === 'O(logn)' || s === 'O(logn)') return Math.log2(n);
    if (s === 'O(1)') return 1;
    // generic fallbacks
    if (s.includes('n') || s.includes('n^2')) return n * n;
    if (s.includes('nlogn') || s.includes('nlog')) return n * Math.log2(n);
    if (s.includes('n')) return n;
    return n;
}

