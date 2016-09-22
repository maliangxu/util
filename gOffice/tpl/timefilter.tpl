    <div id="${prefix}-ul">
		<div class="${prefix}-li ${prefix}-title">选择时间：</div>
        <ul>
	    	<li class="${prefix}-li">
	    		<select id="${prefix}-year" litype='year' pretype='null' class="${prefix}-select">                
               	</select>
               	<label>年</label>
            </li>
	    	<li class="${prefix}-li">
                <label>第</label>
	    		<select id="${prefix}-season" litype='season' pretype='year' class="${prefix}-select">
                    <option value='0' class="${prefix}-firopt">季度</option>
                </select>
                <label>季度</label>
	    	</li>
	    	<li class="${prefix}-li">
	    		<select id="${prefix}-month" litype='month' pretype='season' class="${prefix}-select">
                    <option value='0' class="${prefix}-firopt">月份</option>
                </select>
                <label>月</label>
	    	</li>
	    	<li class="${prefix}-li">
	    		<label>第</label>
                <select id="${prefix}-week" litype='week' pretype='month' class="${prefix}-select"> 
                	<option value='0' class="${prefix}-firopt">周</option>                   
                </select>
                <label>周</label>
	    	</li>
        </ul>
	</div>
	<span id="${prefix}-thisWeek">本周</span>
    <!-- <span id="${prefix}-dateWarn" class='${prefix}-dateWarn'></span> -->
    <span id='${prefix}-dateWarn-se' class='${prefix}-dateWarn'></span>