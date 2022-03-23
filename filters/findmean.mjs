export function findmean(time_stamps)
{
    var total = 0;
    for (var x = 1; x < time_stamps.length; x++)
    {
        total += time_stamps[x] - time_stamps[x-1];
    }
    //console.log(total)
    return total/time_stamps.length
}
