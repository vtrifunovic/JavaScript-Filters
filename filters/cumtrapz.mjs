export function cumtrapz(data, tstamps)
{
    var cumsum = [0];
    var interval = tstamps;
    var tot = data.length;
    for (var x = 0; x < tot-1; x++)
    {
        cumsum[x+1] = (((data[x]+data[x+1])/2)*interval) + cumsum[x];
    }
    return cumsum;
}