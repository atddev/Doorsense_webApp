var Logg = DS.Model.extend({
    event: DS.attr('string'),
    stime: DS.attr('string'),
    vis_date: DS.attr('string'),
    vis_time: DS.attr('string'),
});

module.exports = Logg;

