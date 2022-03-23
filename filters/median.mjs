export function medianfilter(dataset, length)
{
    var window = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var dataset2 = [];
    //does this make it 3rd order? ;-;
    for (var order = 0; order < 3; order++)
    {
        for (var row = 0; row < length; row++)
        {
            window[0] = dataset[row-4];
            window[1] = dataset[row-3];
            window[2] = dataset[row-2];
            window[3] = dataset[row-1];
            window[4] = dataset[row];
            window[5] = dataset[row+1];
            window[6] = dataset[row+2];
            window[7] = dataset[row+3];
            window[8] = dataset[row+4];

            var newWindow = insertionSort(window, 9);
            dataset2[row] = newWindow[4];
        }
    }
    return dataset2;
}

function insertionSort(arr, val)
{
    var j; var key;
    var array = [];
    for (var k = 1; k < val; k++)
    {
        key = arr[k];
        j = k-1;
        while (j >= 0 && arr[j] > key)
        {
            arr[j+1] = arr[j];
            j = j - 1;
        }
        arr[j+1] = key;
    }
    return arr;
}