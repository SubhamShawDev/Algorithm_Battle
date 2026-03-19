const algorithms = {
    'quick-sort': {
        title: 'Quick Sort',
        desc: "A highly efficient sorting algorithm that uses a divide-and-conquer strategy to quickly sort items within an array. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays.",
        best: 'O(n log n)',
        avg: 'O(n log n)',
        worst: 'O(n²)',
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
        avg: 'O(n²)',
        worst: 'O(n²)',
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
        best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
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
        best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
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
        best: 'O(n log n)', avg: 'O(n log² n)', worst: 'O(n²)', space: 'O(1)',
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
        }
    },
    'dual-pivot-quick-sort': {
        title: 'Dual Pivot Quick Sort',
        desc: "A variation of Quick Sort using two pivots instead of one. It divides the array into three sections, leading to fewer comparisons and swaps in practice.",
        best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
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
let benchTimeUnit = 'ms'; // 'ms', 'µs', 'ns'
let storedTheoreticalBestMs = 0;
let storedTheoreticalAvgMs = 0;
let storedTheoreticalWorstMs = 0;

// Theoretical complexity calculator
function computeTheoretical(n, complexityStr) {
    if (!n || n <= 0) return '—';
    let ops = 0;
    const s = complexityStr.replace(/\s/g, '');
    if (s === 'O(nlogn)' || s === 'O(n log n)') {
        ops = n * Math.log2(n);
    } else if (s === 'O(n²)' || s === 'O(n^2)') {
        ops = n * n;
    } else if (s === 'O(n)') {
        ops = n;
    } else if (s === 'O(logn)' || s === 'O(log n)') {
        ops = Math.log2(n);
    } else if (s === 'O(1)') {
        ops = 1;
    } else if (s === 'O(n²/2)') {
        ops = (n * n) / 2;
    } else {
        // Try to parse generically
        if (s.includes('n²')) ops = n * n;
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
    if (unit === 'µs') return (ms * 1000).toFixed(2);
    if (unit === 'ns') return (ms * 1000000).toFixed(0);
    return ms.toFixed(2);
}

// Get raw ops count for a complexity string and n
function computeTheoreticalOps(n, complexityStr) {
    if (!n || n <= 0) return 0;
    const s = complexityStr.replace(/\s/g, '');
    if (s === 'O(nlogn)' || s === 'O(nlog n)') return n * Math.log2(n);
    if (s === 'O(n²)' || s === 'O(n^2)') return n * n;
    if (s === 'O(n)') return n;
    if (s === 'O(logn)' || s === 'O(logn)') return Math.log2(n);
    if (s === 'O(1)') return 1;
    // generic fallbacks
    if (s.includes('n²') || s.includes('n^2')) return n * n;
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
// Uses calibrated per-op cost × theoretical operation count for the given N
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
        btnStartVis: document.getElementById('btn-start-visualization')
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
    });

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
    const algorithmCode = {
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

        'pdq-sort': `// Simplified Pattern-Defeating Quicksort (PDQSort)
function pdqSort(arr) {
    pdqSortLoop(arr, 0, arr.length, Math.log2(arr.length));
    return arr;
}

function pdqSortLoop(arr, begin, end, badAllowed, leftmost = true) {
    while (true) {
        let size = end - begin;
        if (size < 24) {
            insertionSort(arr, begin, end);
            return;
        }
        
        let pivotPos = choosePivot(arr, begin, end);
        if (leftmost && arr[begin] > arr[pivotPos]) {
            swap(arr, begin, pivotPos);
        }
        
        let part = partitionRight(arr, begin, end, pivotPos);
        let pivotIdx = part.pivotIdx;
        let highlyUnbalanced = part.highlyUnbalanced;
        
        pdqSortLoop(arr, begin, pivotIdx, badAllowed, leftmost);
        
        begin = pivotIdx + 1;
        leftmost = false;
        
        if (highlyUnbalanced) {
            if (--badAllowed === 0) {
                heapSort(arr, begin, end);
                return;
            }
        }
    }
}`,

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

    function highlightCodeForExecution(code) {
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

        UI.benchFileLabel.textContent = file.name;
        UI.benchFileLabel.classList.add('text-rose-400');
        UI.btnDeleteFile.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = (evt) => {
            let text = evt.target.result;

            // Remove text UI groups like '--- Group: 10 to 100 ---' from averageCase.txt
            text = text.replace(/---.*?---/g, '');

            // Parse comma, space, or newline separated numbers in O(N)
            const nums = [];
            const tokens = text.split(/[\s,]+/);
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (token !== "") {
                    const num = Number(token);
                    if (!isNaN(num)) {
                        nums.push(num);
                    }
                }
            }

            if (nums.length > 0) {
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
            } else {
                benchmarkData = null;
                UI.benchStatus.textContent = "INVALID DATA";
                UI.benchStatus.className = "text-rose-500 font-bold text-sm mt-1";
            }
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
        UI.benchTheoryBest.textContent = '—';
        UI.benchTheoryAvg.textContent = '—';
        UI.benchTheoryWorst.textContent = '—';
        UI.benchActualTime.textContent = '0.00';
        UI.benchTheoreticalTime.textContent = '0.00';
        UI.benchDiffBadge.textContent = '—';
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
        const units = ['ms', 'µs', 'ns'];
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

            // === PURE RAW TIMING — no async, no overhead ===
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

            // === OPS COUNTING — separate untimed pass ===
            // Run RawSortAPI on a fresh copy just to count comparisons/swaps
            const countCopy = [...benchmarkData];
            if (algo.runRaw) {
                // Estimate ops from theoretical complexity
                const avgComplexity = algo.avg.replace(/\s/g, '');
                if (avgComplexity.includes('nlogn') || avgComplexity.includes('nlog')) {
                    comparisons = Math.round(n * Math.log2(n));
                    swaps = Math.round(n * Math.log2(n) / 3);
                } else if (avgComplexity.includes('n²') || avgComplexity.includes('n^2')) {
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
            // These are INDEPENDENT of actual time — based on machine-calibrated per-op cost
            storedTheoreticalBestMs = computeTheoreticalTimeMs(n, algo.best);
            storedTheoreticalAvgMs = computeTheoreticalTimeMs(n, algo.avg);
            storedTheoreticalWorstMs = computeTheoreticalTimeMs(n, algo.worst);

            // Render all time displays in current unit
            updateAllTimeDisplays();

            // Diff badge: show how actual compares to theoretical avg
            const diffPercent = ((benchmarkTimeMs - storedTheoreticalAvgMs) / storedTheoreticalAvgMs) * 100;
            if (Math.abs(diffPercent) < 1) {
                UI.benchDiffBadge.textContent = '≈ Matches Theory';
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
            el.classList.remove('bg-white/10', 'border-amber-400');
            el.classList.add('border-transparent');
        });
        
        const targetLine = document.getElementById(`exec-line-${lineNum}`);
        if (targetLine) {
            targetLine.classList.remove('border-transparent');
            targetLine.classList.add('bg-white/10', 'border-amber-400');
            
            // Auto scroll container
            targetLine.scrollIntoView({ behavior: 'auto', block: 'nearest' });
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
                el.classList.remove('bg-white/10', 'border-amber-400');
                el.classList.add('border-transparent');
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
        UI.benchTheoryBest.textContent = "—";
        UI.benchTheoryAvg.textContent = "—";
        UI.benchTheoryWorst.textContent = "—";
        UI.benchActualTime.textContent = '0.00';
        UI.benchTheoreticalTime.textContent = '0.00';
        UI.benchDiffBadge.textContent = '—';
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

    function showArena() {
        if (homePage && arenaPage) {
            homePage.classList.add('hidden');
            homePage.classList.remove('flex');
            arenaPage.classList.remove('hidden');
            arenaPage.classList.add('flex');
        }
    }

    function showHome() {
        if (homePage && arenaPage) {
            arenaPage.classList.add('hidden');
            arenaPage.classList.remove('flex');
            homePage.classList.remove('hidden');
            homePage.classList.add('flex');
        }
    }

    if (btnGoArena) btnGoArena.addEventListener('click', showArena);
    if (btnStart) btnStart.addEventListener('click', showArena);
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
            if (selectorLeft) {
                selectorLeft.classList.add('cursor-pointer', 'group');
            }

            showArena();
        });
    }
    if (btnHome) btnHome.addEventListener('click', showHome);
});
