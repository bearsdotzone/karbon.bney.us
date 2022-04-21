import java.io.File;
import java.io.FileNotFoundException;
import java.util.Map.Entry;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;


public class CommonNames {
	public static void main(String[] args) throws FileNotFoundException {
		// TODO Auto-generated method stub
		Scanner scn = new Scanner(new File("commonnames.dat"));
		scn.nextLine();
		while (scn.hasNextLine()) {
			Map <String, Integer> namesMap = new TreeMap<String, Integer>();
			String nameString = scn.nextLine();
			String[] namesArray = nameString.split(" ");
			for (int x = 0; x< namesArray.length; x++) {
				if(!namesMap.containsKey(namesArray[x])) {
					namesMap.put(namesArray[x], new Integer(1));
				}
				else {
					namesMap.put(namesArray[x], namesMap.get(namesArray[x]) + 1);
				}
			}
			String biggestKeys = "";
			Integer biggestValue = new Integer(0);
			for (Entry<String, Integer> entry : namesMap.entrySet()) {
				String key = entry.getKey();
				Integer value = entry.getValue();
				if (value.equals(biggestValue)) {
					biggestKeys += " " + key;
				}
				if (value > biggestValue) {
					biggestKeys = key;
					biggestValue = value;
				}
			}
			System.out.println(biggestKeys);
		}
	}

}
