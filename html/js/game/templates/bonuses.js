/*
 * Bonus is a value added to effect of action under some conditions, mentioned inside the bonus object
 */

// structure is a json of pairs "condition" - "value", and finally time

// all - means that bonus will affect all actions,
// here can be any condition we event later
//
// time - can be "fight", "forever", "day" or number of rounds in a fight
//
function basic_bonus(val, rounds_lasts) {
	var b = {all : val, time : rounds_lasts};
	return b;
}
