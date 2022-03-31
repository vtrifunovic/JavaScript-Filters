export function lineardetrend(values_x, values_y)
{
    var trend = findLineByLeastSquares(values_x, values_y);
    var totval = values_y.length;
    for (var j = 0; j < totval; j++)
    {
        values_y[j] = values_y[j]// - (trend[1][j]);
    }
    return values_y;
}

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        console.log(values_length + " != " + values_y.length)
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    if (values_length === 0) {
        return [ [], [] ];
    }

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    var result_values_x = [];
    var result_values_y = [];

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [result_values_x, result_values_y];
}