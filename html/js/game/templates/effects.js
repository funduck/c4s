var TemplateEffect = {
	value : "number, 1 - 6",
	regular : "",
	head : "",
	torso : "",
	feet : ""
};

// it is a small test table, that contains all info which attack effect causes what

test_effects = 
		[{value : 1, regular : {modificator : {}, bonuses : []}},
		 {value : 2, regular : {modificator : {bh:"-1"}, bonuses : [{all:-1, time : 1}]}},
		 {value : 3, regular : {modificator : {bh:"-2"}, bonuses : [{all:-2, time : 1}]}},
		 {value : 4, regular : {modificator : {bh:"-3"}, bonuses : [{all:-2, time : 2}]}},
		 {value : 5, regular : {modificator : {bh:"-4"}, bonuses : [{all:-3, time : 1}]}},
		 {value : 6, regular : {modificator : {hlt:"-2"}, bonuses : [{all:-3, time : "fight"}]}}
		]
;